import { Request, Response } from 'express';
import { SettingsService } from '../services/settingsService';
import { getTranslation } from '../utils/translator';
import { AppDataSource } from '../database/data-source';
import { Translation } from '../entities/Translation';

const settingsService = new SettingsService();

export const getAllSettings = async (req: Request, res: Response) => {
    try {
        const settings = await settingsService.getAllSettings();
        const lang = req.cookies['NEXT_LOCALE'] || req.query.lang as string || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
        
        if (lang !== 'en' && ['fr', 'zh', 'de', 'es', 'ne'].includes(lang)) {
            const translatedSettings: Record<string, string> = {};
            for (const [key, value] of Object.entries(settings)) {
                if (
                    key.includes('img') || 
                    key.includes('rate') || 
                    key.includes('phone') || 
                    key.includes('email') || 
                    key.includes('whatsapp') || 
                    key.includes('facebook') || 
                    key.includes('instagram')
                ) {
                    translatedSettings[key] = value as string;
                } else {
                    translatedSettings[key] = await getTranslation('setting', key, 'value', value as string, lang);
                }
            }
            return res.status(200).json(translatedSettings);
        }

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
        
        // Invalidate settings translation cache
        try {
            const translationRepo = AppDataSource.getRepository(Translation);
            for (const key of Object.keys(updates)) {
                await translationRepo.delete({ entityType: 'setting', entityId: key });
            }
        } catch (cacheErr) {
            console.error('Failed to invalidate settings translation cache:', cacheErr);
        }

        res.status(200).json({ message: 'Settings updated', count: results.length });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

