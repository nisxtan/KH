import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Inquiry } from '../entities/Inquiry';
import { sendEmail } from '../utils/mailSender';
import { ENV } from '../config/env';

export class InquiryController {
    private repo = AppDataSource.getRepository(Inquiry);

    async submitInquiry(req: Request, res: Response) {
        try {
            const { name, email, subject, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ message: 'Name, email and message are required' });
            }

            // 1. Save to database
            const inquiry = new Inquiry();
            inquiry.name = name;
            inquiry.email = email;
            inquiry.subject = subject;
            inquiry.message = message;
            await this.repo.save(inquiry);

            // 2. Send email notification to admin
            const adminEmail = ENV.SMTP_USER || 'nischaltan@gmail.com';
            const emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                    <h2 style="color: #1a202c; border-bottom: 2px solid #fbd38d; padding-bottom: 8px;">New Inquiry Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
                    <div style="margin-top: 16px; padding: 16px; bg-color: #f7fafc; border-radius: 8px; border-left: 4px solid #fbd38d;">
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="margin-top: 24px; font-size: 12px; color: #718096;">Sent from Kiran Handicraft Contact Form</p>
                </div>
            `;

            await sendEmail(adminEmail, `New Inquiry: ${subject || 'General Inquiry'}`, emailHtml);

            res.status(201).json({ message: 'Inquiry submitted successfully' });
        } catch (error) {
            console.error('Inquiry submission error:', error);
            res.status(500).json({ message: 'Failed to submit inquiry' });
        }
    }

    async getInquiries(req: Request, res: Response) {
        try {
            const inquiries = await this.repo.find({ order: { createdAt: 'DESC' } });
            res.json(inquiries);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch inquiries' });
        }
    }
}
