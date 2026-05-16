import { Router } from 'express';
import productRoutes from './productRoutes';
import authRoutes from './authRoutes';
import settingsRoutes from './settingsRoutes';
import uploadRoutes from './uploadRoutes';
import categoryRoutes from './categoryRoutes';
import inquiryRoutes from './inquiryRoutes';

console.log('Loading API routes...');
const router = Router();
console.log('Registering inquiry routes...');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);
router.use('/categories', categoryRoutes);
router.use('/inquiries', inquiryRoutes);

export default router;
