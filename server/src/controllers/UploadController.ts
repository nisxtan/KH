import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        // Upload to Cloudinary using a buffer
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'kiran_handicraft' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file!.buffer);
        });

        const result = uploadResponse as any;
        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Image upload failed' });
    }
};
