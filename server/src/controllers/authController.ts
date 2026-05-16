import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};
