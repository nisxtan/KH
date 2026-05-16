import { Client } from 'pg';

const createDatabase = async () => {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        password: 'postgres',
        port: 5432,
    });

    try {
        await client.connect();
        await client.query('CREATE DATABASE kiran_handicraft');
        console.log('✅ Database kiran_handicraft created successfully');
    } catch (error: any) {
        if (error.code === '42P04') {
            console.log('ℹ️ Database kiran_handicraft already exists');
        } else {
            console.error('❌ Failed to create database:', error.message);
        }
    } finally {
        await client.end();
    }
};

createDatabase();
