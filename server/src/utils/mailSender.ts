import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: ENV.SMTP_HOST,
        port: Number(ENV.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: ENV.SMTP_USER,
            pass: ENV.SMTP_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: `"Kiran Handicraft" <${ENV.SMTP_FROM}>`,
        to,
        subject,
        html,
    });

    return info;
};
