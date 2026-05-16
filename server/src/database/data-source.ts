import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ENV } from '../config/env';
import path from 'path';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: ENV.DATABASE_URL,
    synchronize: ENV.NODE_ENV === 'development',
    logging: ENV.NODE_ENV === 'development',
    entities: [path.join(__dirname, '../entities/*.{ts,js}')],
    migrations: [path.join(__dirname, '../database/migrations/*.{ts,js}')],
    subscribers: [],
    ssl: ENV.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
