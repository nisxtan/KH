import { AppDataSource } from '../database/data-source';
import { SiteSetting } from '../entities/SiteSetting';

export class SettingsService {
    private repo = AppDataSource.getRepository(SiteSetting);

    async getAllSettings() {
        const settings = await this.repo.find({ order: { section: 'ASC' } });
        // Return as key-value map for easy consumption
        return settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {} as Record<string, string>);
    }

    async getAllSettingsGrouped() {
        const settings = await this.repo.find({ order: { section: 'ASC', id: 'ASC' } });
        // Group by section for admin forms
        return settings.reduce((acc, s) => {
            if (!acc[s.section]) acc[s.section] = [];
            acc[s.section].push(s);
            return acc;
        }, {} as Record<string, SiteSetting[]>);
    }

    async updateSetting(key: string, value: string) {
        const setting = await this.repo.findOne({ where: { key } });
        if (!setting) throw new Error(`Setting "${key}" not found`);
        setting.value = value;
        return await this.repo.save(setting);
    }

    async bulkUpdate(updates: Record<string, string>) {
        const results = [];
        for (const [key, value] of Object.entries(updates)) {
            try {
                const setting = await this.repo.findOne({ where: { key } });
                if (setting) {
                    setting.value = value;
                    results.push(await this.repo.save(setting));
                }
            } catch (e) {
                console.error(`Failed to update setting: ${key}`, e);
            }
        }
        return results;
    }
}
