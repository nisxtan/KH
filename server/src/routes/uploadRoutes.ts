import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/UploadController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Use memory storage for Cloudinary streaming
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', authMiddleware, upload.single('image'), uploadImage);

export default router;
