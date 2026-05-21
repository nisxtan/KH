import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Category } from '../entities/Category';
import { getTranslation } from '../utils/translator';
import { Translation } from '../entities/Translation';

const categoryRepo = AppDataSource.getRepository(Category);

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryRepo.find({
            order: { name: 'ASC' }
        });
        
        const lang = req.cookies['NEXT_LOCALE'] || req.query.lang as string || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
        
        if (lang !== 'en' && ['fr', 'zh', 'de', 'es', 'ne'].includes(lang)) {
            const translatedCategories = await Promise.all(
                categories.map(async (cat: any) => {
                    const translatedName = await getTranslation('category', cat.id, 'name', cat.name, lang);
                    return {
                        ...cat,
                        name: translatedName
                    };
                })
            );
            return res.json(translatedCategories);
        }

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const category = categoryRepo.create({ name, description });
        await categoryRepo.save(category);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await categoryRepo.delete(id);
        
        // Delete all cached translations for this category
        try {
            const translationRepo = AppDataSource.getRepository(Translation);
            await translationRepo.delete({ entityType: 'category', entityId: String(id) });
        } catch (cacheErr) {
            console.error('Failed to clear category translations on deletion:', cacheErr);
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};

