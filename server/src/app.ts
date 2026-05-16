import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import apiRoutes from './routes/apiRoutes';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Debug logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
console.log('Mounting /api routes...');
app.use('/api', apiRoutes);
console.log('Routes mounted.');

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Kiran Handicraft API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: ENV.NODE_ENV === 'development' ? err : {},
    });
});

export default app;
