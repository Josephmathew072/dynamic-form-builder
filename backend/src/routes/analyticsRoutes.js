import express from 'express';
import { getAnalytics, getDashboardStats } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard/stats', getDashboardStats);
router.get('/:formId', getAnalytics);

export default router;