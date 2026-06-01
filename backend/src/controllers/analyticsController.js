import Response from '../models/Response.js';
import Form from '../models/Form.js';
import { computeAnalytics } from '../utils/analyticsEngine.js';
import {
  getCurrentIST,
  getISTMonthBoundaries,
  getCurrentISTMonth,
  getPreviousISTMonth,
  isEarlyInISTMonth,
  formatIST
} from '../utils/dateUtils.js';

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

    // Get recent activity (last 5 responses) - format time in IST
    const recentActivityRaw = await Response.aggregate([
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

    // Format recent activity with IST time
    const recentActivity = recentActivityRaw.map(activity => ({
      id: activity._id,
      action: activity.action,
      form: activity.formTitle,
      // time: formatIST(activity.time, 'full')
      time: activity.time
    }));

    // Get current date in IST
    const istNow = getCurrentIST();
    const currentYear = istNow.getFullYear();
    const currentMonth = istNow.getMonth();

    // Get current month boundaries in IST
    const { startUTC: currentMonthStart, endUTC: currentMonthEnd } =
      getISTMonthBoundaries(currentYear, currentMonth);

    // Get previous month boundaries in IST
    const { startUTC: lastMonthStart, endUTC: lastMonthEnd } =
      getISTMonthBoundaries(currentYear, currentMonth - 1);

    // Get response counts for current and previous month
    const currentMonthResponses = await Response.countDocuments({
      submittedAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
    });

    const lastMonthResponses = await Response.countDocuments({
      submittedAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    // Get month names
    const currentMonthName = getCurrentISTMonth();
    const lastMonthName = getPreviousISTMonth();

    // Check if early in month (first 7 days of IST month)
    const isEarlyMonth = isEarlyInISTMonth();

    // Calculate trend
    let responseTrend = 0;
    let trendDirection = 'stable';
    let trendMessage = 'No change';
    let trendDetails = '';

    if (lastMonthResponses === 0 && currentMonthResponses === 0) {
      responseTrend = 0;
      trendDirection = 'stable';
      trendMessage = 'No responses yet';
      trendDetails = 'Start sharing your forms to collect responses';
    } else if (lastMonthResponses === 0 && currentMonthResponses > 0) {
      responseTrend = 100;
      trendDirection = 'up';
      trendMessage = `+${currentMonthResponses} this month`;
      trendDetails = `Started receiving responses in ${currentMonthName}`;
    } else if (lastMonthResponses > 0 && currentMonthResponses === 0) {
      if (isEarlyMonth) {
        responseTrend = 0;
        trendDirection = 'stable';
        trendMessage = `Waiting for ${currentMonthName} responses`;
        trendDetails = `${lastMonthName} had ${lastMonthResponses} responses. Share your forms to get more!`;
      } else {
        responseTrend = -100;
        trendDirection = 'down';
        trendMessage = `No responses in ${currentMonthName}`;
        trendDetails = `${lastMonthName} had ${lastMonthResponses} responses`;
      }
    } else {
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

    // Format recent forms dates in IST for response
    const formattedRecentForms = recentForms.map(form => ({
      id: form._id,
      title: form.title,
      fields: form.fields.length,
      // createdAt: formatIST(form.createdAt, 'full')
      createdAt: form.createdAt
    }));

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
      recentForms: formattedRecentForms,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};