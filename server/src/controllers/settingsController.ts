import { Request, Response } from 'express';
import { SettingsService } from '../services/settingsService';

const settingsService = new SettingsService();

export const getAllSettings = async (req: Request, res: Response) => {
    try {
        const settings = await settingsService.getAllSettings();
        res.status(200).json(settings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getGroupedSettings = async (req: Request, res: Response) => {
    try {
        const settings = await settingsService.getAllSettingsGrouped();
        res.status(200).json(settings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const bulkUpdateSettings = async (req: Request, res: Response) => {
    try {
        const updates = req.body as Record<string, string>;
        if (!updates || typeof updates !== 'object') {
            return res.status(400).json({ message: 'Invalid request body' });
        }
        const results = await settingsService.bulkUpdate(updates);
        res.status(200).json({ message: 'Settings updated', count: results.length });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
