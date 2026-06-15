import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/UploadController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Use memory storage for Cloudinary streaming
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'));
        }
    }
});

router.post('/', authMiddleware, upload.single('image'), uploadImage);

export default router;
