import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

const productService = new ProductService();

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const filters = {
            categoryId: req.query.categoryId,
            categorySlug: req.query.categorySlug,
            featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
            available: req.query.available === 'true' ? true : req.query.available === 'false' ? false : undefined,
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit,
        };
        const result = await productService.getAllProducts(filters);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const product = await productService.getProductBySlug(req.params.slug as string);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await productService.updateProduct(parseInt(req.params.id as string), req.body);
        res.status(200).json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await productService.deleteProduct(parseInt(req.params.id as string));
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const uploadImages = async (req: Request, res: Response) => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }
        const imageUrls = await productService.uploadImages(req.files as Express.Multer.File[]);
        res.status(200).json({ images: imageUrls });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
