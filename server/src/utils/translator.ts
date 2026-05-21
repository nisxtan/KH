import axios from 'axios';
import { AppDataSource } from '../database/data-source';
import { Translation } from '../entities/Translation';

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    if (!text || text.trim() === '') return '';
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url);
        if (response.data && response.data[0]) {
            const translated = response.data[0].map((x: any) => x[0]).join('');
            return translated;
        }
        return text;
    } catch (error) {
        console.error(`[Translator] Google translate error for "${text.substring(0, 20)}...":`, error);
        return text;
    }
}

export async function getTranslation(
    entityType: string,
    entityId: string | number,
    field: string,
    originalText: string,
    targetLanguage: string
): Promise<string> {
    // English is the default base language - no translation needed
    if (!targetLanguage || targetLanguage === 'en') return originalText;

    const idStr = String(entityId);
    try {
        const translationRepo = AppDataSource.getRepository(Translation);

        // Check cache first
        const cache = await translationRepo.findOne({
            where: { entityType, entityId: idStr, field, language: targetLanguage }
        });

        if (cache) {
            return cache.translatedText;
        }

        // If not cached, translate using Google Translate
        const translated = await translateText(originalText, targetLanguage);

        // Save to cache for future requests
        const newTrans = translationRepo.create({
            entityType,
            entityId: idStr,
            field,
            language: targetLanguage,
            translatedText: translated
        });
        await translationRepo.save(newTrans);

        return translated;
    } catch (error) {
        console.error(`[Translator] Error fetching translation for ${entityType} #${entityId}:`, error);
        return originalText;
    }
}
