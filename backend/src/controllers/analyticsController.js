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
    
    // Get current date in local timezone
    const now = new Date();
    const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    
    // Calculate month boundaries in local timezone
    const currentMonthStart = new Date(localNow.getFullYear(), localNow.getMonth(), 1);
    const lastMonthStart = new Date(localNow.getFullYear(), localNow.getMonth() - 1, 1);
    const nextMonthStart = new Date(localNow.getFullYear(), localNow.getMonth() + 1, 1);
    
    // Convert to UTC for MongoDB query (query start of day in local timezone)
    const currentMonthStartUTC = new Date(currentMonthStart.getTime() + (now.getTimezoneOffset() * 60000));
    const lastMonthStartUTC = new Date(lastMonthStart.getTime() + (now.getTimezoneOffset() * 60000));
    const nextMonthStartUTC = new Date(nextMonthStart.getTime() + (now.getTimezoneOffset() * 60000));
    
    // Get responses for current month (local timezone)
    const currentMonthResponses = await Response.countDocuments({
      submittedAt: { $gte: currentMonthStartUTC, $lt: nextMonthStartUTC }
    });
    
    // Get responses for last month (local timezone)
    const lastMonthResponses = await Response.countDocuments({
      submittedAt: { $gte: lastMonthStartUTC, $lt: currentMonthStartUTC }
    });
    
    // Get month names for display
    const currentMonthName = currentMonthStart.toLocaleDateString('en-US', { month: 'long' });
    const lastMonthName = lastMonthStart.toLocaleDateString('en-US', { month: 'long' });
    
    // Calculate trend with proper handling
    let responseTrend = 0;
    let trendDirection = 'stable';
    let trendMessage = 'No change';
    let trendDetails = '';
    
    // Check if current month just started (within first 7 days of local month)
    const currentDay = localNow.getDate();
    const isEarlyMonth = currentDay <= 7;
    
    if (lastMonthResponses === 0 && currentMonthResponses === 0) {
      // No responses in either month
      responseTrend = 0;
      trendDirection = 'stable';
      trendMessage = 'No responses yet';
      trendDetails = 'Start sharing your forms to collect responses';
    } else if (lastMonthResponses === 0 && currentMonthResponses > 0) {
      // New responses this month
      responseTrend = 100;
      trendDirection = 'up';
      trendMessage = `+${currentMonthResponses} this month`;
      trendDetails = `Started receiving responses in ${currentMonthName}`;
    } else if (lastMonthResponses > 0 && currentMonthResponses === 0) {
      if (isEarlyMonth) {
        // Early in the month, show optimistic message
        responseTrend = 0;
        trendDirection = 'stable';
        trendMessage = `Waiting for ${currentMonthName} responses`;
        trendDetails = `${lastMonthName} had ${lastMonthResponses} responses. Share your forms to get more!`;
      } else {
        // Late in month with no responses
        responseTrend = -100;
        trendDirection = 'down';
        trendMessage = `No responses in ${currentMonthName}`;
        trendDetails = `${lastMonthName} had ${lastMonthResponses} responses`;
      }
    } else {
      // Calculate percentage change
      const percentageChange = ((currentMonthResponses - lastMonthResponses) / lastMonthResponses) * 100;
      const absPercentage = Math.abs(percentageChange);
      responseTrend = Math.round(absPercentage);
      trendDirection = percentageChange >= 0 ? 'up' : 'down';
      
      if (percentageChange >= 0) {
        trendMessage = `+${currentMonthResponses} this month`;
        trendDetails = `${absPercentage.toFixed(1)}% increase from ${lastMonthName}`;
      } else {
        trendMessage = `${currentMonthResponses} this month`;
        trendDetails = `${absPercentage.toFixed(1)}% decrease from ${lastMonthName}`;
      }
    }
    
    res.json({
      totalForms,
      totalResponses,
      activeForms,
      responseTrend,
      trendDirection,
      trendMessage,
      trendDetails,
      currentMonthResponses,
      lastMonthResponses,
      currentMonthName,
      lastMonthName,
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