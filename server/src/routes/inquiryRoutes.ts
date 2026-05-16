import { Router } from 'express';
import { InquiryController } from '../controllers/inquiryController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new InquiryController();

router.post('/', controller.submitInquiry.bind(controller));
router.get('/', authMiddleware, controller.getInquiries.bind(controller));

export default router;
