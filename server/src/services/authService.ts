import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database/data-source';
import { User } from '../entities/User';
import { ENV } from '../config/env';

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async login(username: string, password: string) {
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            ENV.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    }

    async getMe(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        
        return {
            id: user.id,
            username: user.username,
            email: user.email
        };
    }
}
