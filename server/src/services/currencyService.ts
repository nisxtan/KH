import axios from 'axios';
import { AppDataSource } from '../database/data-source';
import { SiteSetting } from '../entities/SiteSetting';

export const updateCurrencyRates = async () => {
    try {
        console.log('🔄 Fetching latest currency rates from ExchangeRate-API...');
        // Free API, no key required for basic usage. Base is USD.
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const rates = response.data.rates;

        if (!rates || !rates.NPR) {
            console.error('❌ Invalid currency data received.');
            return;
        }

        const settingsRepo = AppDataSource.getRepository(SiteSetting);
        
        // ExchangeRate-API returns rates relative to USD (1 USD = X Currency)
        // The site expects 1 Foreign Currency = X NPR
        const usdToNpr = rates.NPR;
        const eurToNpr = rates.NPR / rates.EUR;
        const audToNpr = rates.NPR / rates.AUD;
        const gbpToNpr = rates.NPR / rates.GBP;

        const updates = [
            { key: 'currency_usd_rate', value: usdToNpr.toFixed(2) },
            { key: 'currency_eur_rate', value: eurToNpr.toFixed(2) },
            { key: 'currency_aud_rate', value: audToNpr.toFixed(2) },
            { key: 'currency_gbp_rate', value: gbpToNpr.toFixed(2) },
        ];

        for (const update of updates) {
            let setting = await settingsRepo.findOne({ where: { key: update.key } });
            if (setting) {
                setting.value = update.value;
                await settingsRepo.save(setting);
            }
        }
        
        console.log(`✅ Currency rates automatically updated (USD: ${usdToNpr.toFixed(2)} NPR, EUR: ${eurToNpr.toFixed(2)} NPR)`);
    } catch (error) {
        console.error('❌ Failed to update currency rates:', (error as Error).message);
    }
};

// Run every 12 hours to keep rates fresh
export const startCurrencyCron = () => {
    // Run once on server startup
    updateCurrencyRates();
    
    // Then run every 12 hours (12 * 60 * 60 * 1000 = 43200000 ms)
    setInterval(updateCurrencyRates, 43200000);
};
