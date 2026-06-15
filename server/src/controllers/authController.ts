import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);

        const isProduction = process.env.NODE_ENV === 'production';
        
        // Updated cookie configuration for cross-origin support
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: isProduction,     // Must be true on Render (HTTPS)
            sameSite: isProduction ? 'none' : 'lax', // 'none' allows cross-origin requests
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/',                // Ensure cookie is available on all routes
        });

        console.log(`Login successful for user: ${username}`);
        console.log(`Cookie set with: secure=${isProduction}, sameSite=${isProduction ? 'none' : 'lax'}`);

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Login error:', error.message);
        res.status(401).json({ message: error.message });
    }
};

export const logout = (req: Request, res: Response) => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Clear cookie with same options used when setting it
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    });
    
    console.log('User logged out, cookie cleared');
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.status(200).json(user);
    } catch (error: any) {
        console.error('GetMe error:', error.message);
        res.status(401).json({ message: error.message });
    }
};