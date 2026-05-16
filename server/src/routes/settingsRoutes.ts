import { Router } from 'express';
import { getAllSettings, getGroupedSettings, bulkUpdateSettings } from '../controllers/settingsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Public: fetch flat key-value for page rendering
router.get('/', getAllSettings);

// Admin: fetch grouped by section for forms
router.get('/grouped', authMiddleware, getGroupedSettings);

// Admin: bulk update
router.put('/', authMiddleware, bulkUpdateSettings);

export default router;
