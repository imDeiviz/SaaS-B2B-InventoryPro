import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
import routes from './routes/index.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Professional Logging Strategy
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

app.use(express.json());

// Debug logger
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', routes);

// Base route
app.get('/', (req, res) => {
    res.json({
        message: 'InventoryPro API is live',
        version: '1.0.0',
        environment: process.env.NODE_ENV
    });
});

// Health Check (Twelve-Factor App requirement)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

export default app;
