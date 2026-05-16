import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Category } from '../entities/Category';

const categoryRepo = AppDataSource.getRepository(Category);

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryRepo.find({
            order: { name: 'ASC' }
        });
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
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};
