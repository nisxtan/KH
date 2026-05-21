import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { getTranslation } from '../utils/translator';
import { AppDataSource } from '../database/data-source';
import { Translation } from '../entities/Translation';

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
        
        const lang = req.cookies['NEXT_LOCALE'] || req.query.lang as string || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
        
        if (lang !== 'en' && ['fr', 'zh', 'de', 'es', 'ne'].includes(lang) && result.items) {
            const translatedItems = await Promise.all(
                result.items.map(async (product: any) => {
                    const translatedName = await getTranslation('product', product.id, 'name', product.name, lang);
                    const translatedDesc = await getTranslation('product', product.id, 'description', product.description, lang);
                    
                    if (product.category && product.category.name) {
                        product.category.name = await getTranslation('category', product.category.id, 'name', product.category.name, lang);
                    }

                    return {
                        ...product,
                        name: translatedName,
                        description: translatedDesc
                    };
                })
            );
            return res.status(200).json({
                ...result,
                items: translatedItems,
            });
        }

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductSuggestions = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string || '';
        const lang = req.cookies['NEXT_LOCALE'] || req.query.lang as string || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
        
        const suggestions = await productService.getSuggestions(query, lang);
        res.status(200).json(suggestions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const product = await productService.getProductBySlug(req.params.slug as string);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        const lang = req.cookies['NEXT_LOCALE'] || req.query.lang as string || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
        
        if (lang !== 'en' && ['fr', 'zh', 'de', 'es', 'ne'].includes(lang)) {
            const translatedName = await getTranslation('product', product.id, 'name', product.name, lang);
            const translatedDesc = await getTranslation('product', product.id, 'description', product.description, lang);
            
            if (product.category && product.category.name) {
                product.category.name = await getTranslation('category', product.category.id, 'name', product.category.name, lang);
            }

            return res.status(200).json({
                ...product,
                name: translatedName,
                description: translatedDesc
            });
        }

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
        const productId = parseInt(req.params.id as string);
        const product = await productService.updateProduct(productId, req.body);
        
        // Invalidate product translation cache
        try {
            const translationRepo = AppDataSource.getRepository(Translation);
            await translationRepo.delete({ entityType: 'product', entityId: String(productId) });
        } catch (cacheErr) {
            console.error('Failed to invalidate product translation cache:', cacheErr);
        }

        res.status(200).json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id as string);
        await productService.deleteProduct(productId);
        
        // Delete all cached translations for this product
        try {
            const translationRepo = AppDataSource.getRepository(Translation);
            await translationRepo.delete({ entityType: 'product', entityId: String(productId) });
        } catch (cacheErr) {
            console.error('Failed to clear product translations on deletion:', cacheErr);
        }

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
