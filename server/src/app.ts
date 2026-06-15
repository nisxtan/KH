import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import apiRoutes from './routes/apiRoutes';

const app = express();

// CRITICAL: Enable trust proxy for Render (behind load balancer)
app.set("trust proxy", 1);

// Helper to clean URLs (remove trailing slashes)
const cleanUrl = (url: string) => url.replace(/\/$/, '');

// Parse multiple comma-separated frontend URLs
let allowedOrigins: string[] = ENV.FRONTEND_URL
    ? ENV.FRONTEND_URL.split(',').map((url: string) => cleanUrl(url.trim()))
    : [];

// Add default localhost origins for development
const defaultOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5173",
    "http://localhost:5000",
];

// Add production domains
const productionOrigins = [
    "https://kiranhandicraftenterprises.com.np",
    "https://www.kiranhandicraftenterprises.com.np",
    "https://kh-iota.vercel.app", // Keep old URL temporarily
];

// Combine all origins
allowedOrigins = [...new Set([...defaultOrigins, ...allowedOrigins, ...productionOrigins])];

console.log('=== CORS CONFIGURATION ===');
console.log('NODE_ENV:', ENV.NODE_ENV);
console.log('FRONTEND_URL from env:', ENV.FRONTEND_URL);
console.log('Allowed origins:', allowedOrigins);
console.log('===========================');

// Middlewares
app.use(helmet({
    // Allow cross-origin for API
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Render health checks, server-to-server)
        if (!origin) {
            return callback(null, true);
        }

        // Clean the origin (remove trailing slash)
        const cleanOrigin = cleanUrl(origin);

        if (allowedOrigins.includes(origin) || allowedOrigins.includes(cleanOrigin)) {
            console.log('✅ CORS allowed:', origin);
            callback(null, true);
        } else {
            console.error('❌ CORS blocked:', origin);
            console.error('Allowed origins:', allowedOrigins);
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Debug logger with more details
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    console.log('Cookie header present:', !!req.headers.cookie);
    next();
});

// Routes
console.log('Mounting /api routes...');
app.use('/api', apiRoutes);
console.log('Routes mounted.');

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Kiran Handicraft API is running',
        environment: ENV.NODE_ENV,
        allowedOrigins: ENV.NODE_ENV === 'development' ? allowedOrigins : undefined
    });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
    res.json({
        success: true,
        message: 'CORS is working!',
        timestamp: new Date().toISOString(),
        origin: req.headers.origin,
        allowedOrigins: ENV.NODE_ENV === 'development' ? allowedOrigins : undefined
    });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('=== ERROR DETAILS ===');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);

    // Handle CORS errors specifically
    if (err.message && err.message.startsWith('CORS blocked')) {
        res.status(403).json({
            success: false,
            message: err.message,
            allowedOrigins: allowedOrigins,
            requestedOrigin: req.headers.origin
        });
        return;
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: ENV.NODE_ENV === 'development' ? {
            message: err.message,
            stack: err.stack,
            code: err.code
        } : undefined,
    });
});

export default app;