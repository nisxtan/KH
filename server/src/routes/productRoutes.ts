import { Router } from 'express';
import multer from 'multer';
import { 
    getAllProducts, 
    getProductBySlug, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    uploadImages 
} from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.post('/upload', authMiddleware, upload.array('images', 10), uploadImages);

export default router;
