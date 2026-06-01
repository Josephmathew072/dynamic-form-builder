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
    
    // Calculate trend with better logic
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = currentMonthStart;
    
    const currentMonthResponses = await Response.countDocuments({
      submittedAt: { $gte: currentMonthStart }
    });
    
    const lastMonthResponses = await Response.countDocuments({
      submittedAt: {
        $gte: lastMonthStart,
        $lt: lastMonthEnd
      }
    });
    
    // Calculate trend with proper handling
    let responseTrend = 0;
    let trendDirection = 'stable';
    let trendMessage = 'No change';
    
    if (lastMonthResponses === 0 && currentMonthResponses === 0) {
      // No responses in either month
      responseTrend = 0;
      trendDirection = 'stable';
      trendMessage = 'No responses yet';
    } else if (lastMonthResponses === 0 && currentMonthResponses > 0) {
      // New responses this month
      responseTrend = 100;
      trendDirection = 'up';
      trendMessage = 'Started receiving responses';
    } else if (lastMonthResponses > 0 && currentMonthResponses === 0) {
      // No responses this month
      responseTrend = -100;
      trendDirection = 'down';
      trendMessage = 'No responses this month';
    } else {
      // Calculate percentage change
      const percentageChange = ((currentMonthResponses - lastMonthResponses) / lastMonthResponses) * 100;
      responseTrend = Math.round(Math.abs(percentageChange));
      trendDirection = percentageChange >= 0 ? 'up' : 'down';
      trendMessage = `${Math.abs(percentageChange).toFixed(1)}% ${percentageChange >= 0 ? 'increase' : 'decrease'}`;
    }
    
    res.json({
      totalForms,
      totalResponses,
      activeForms,
      responseTrend,
      trendDirection,
      trendMessage,
      currentMonthResponses,
      lastMonthResponses,
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