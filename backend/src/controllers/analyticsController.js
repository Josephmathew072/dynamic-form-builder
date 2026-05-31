import Response from '../models/Response.js';
import Form from '../models/Form.js';
import { computeAnalytics } from '../utils/analyticsEngine.js';

// @desc    Get analytics for a form
// @route   GET /api/analytics/:formId
export const getAnalytics = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    const responses = await Response.find({ formId: req.params.formId });
    const analytics = computeAnalytics(form, responses);
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (all forms combined)
// @route   GET /api/analytics/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    // Get total forms
    const totalForms = await Form.countDocuments();
    
    // Get total responses across all forms
    const totalResponses = await Response.countDocuments();
    
    // Get active forms (forms with at least one response)
    const formsWithResponses = await Response.aggregate([
      { $group: { _id: "$formId" } },
      { $count: "count" }
    ]);
    const activeForms = formsWithResponses[0]?.count || 0;
    
    // Get recent forms (last 5)
    const recentForms = await Form.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title fields createdAt');
    
    // Get recent activity (last 5 responses)
    const recentActivity = await Response.aggregate([
      { $sort: { submittedAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'forms',
          localField: 'formId',
          foreignField: '_id',
          as: 'form'
        }
      },
      { $unwind: '$form' },
      {
        $project: {
          action: { $literal: 'New response submitted' },
          formTitle: '$form.title',
          time: '$submittedAt'
        }
      }
    ]);
    
    // Get total responses per form for trend calculation
    const currentMonthResponses = await Response.countDocuments({
      submittedAt: { $gte: new Date(new Date().setDate(1)) } // first day of current month
    });
    
    const lastMonthResponses = await Response.countDocuments({
      submittedAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });
    
    const responseTrend = lastMonthResponses === 0 
      ? 100 
      : ((currentMonthResponses - lastMonthResponses) / lastMonthResponses) * 100;
    
    res.json({
      totalForms,
      totalResponses,
      activeForms,
      responseTrend: Math.round(responseTrend),
      recentForms: recentForms.map(form => ({
        id: form._id,
        title: form.title,
        fields: form.fields.length,
        createdAt: form.createdAt
      })),
      recentActivity: recentActivity.map(activity => ({
        id: activity._id,
        action: activity.action,
        form: activity.formTitle,
        time: activity.time
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};