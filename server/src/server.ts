import app from './app';
import { ENV } from './config/env';
import { AppDataSource } from './database/data-source';
import { startCurrencyCron } from './services/currencyService';

const startServer = async () => {
    try {
        // Initialize Database
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully');

        // Start automatic currency exchange rate updates
        startCurrencyCron();

        // Start Server
        app.listen(ENV.PORT, () => {
            console.log(`🚀 Server running on port ${ENV.PORT}`);
            console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
