import { AppDataSource } from '../database/data-source';
import { Product } from '../entities/Product';
import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../config/env';

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
});

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);

    async getAllProducts(filters: any) {
        const query = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category');

        if (filters.categoryId) {
            query.andWhere('product.categoryId = :categoryId', { categoryId: filters.categoryId });
        }

        if (filters.categorySlug) {
            query.andWhere('LOWER(category.slug) = LOWER(:categorySlug)', { categorySlug: filters.categorySlug });
        }

        if (filters.featured !== undefined) {
            query.andWhere('product.featured = :featured', { featured: filters.featured });
        }

        if (filters.available !== undefined) {
            query.andWhere('product.available = :available', { available: filters.available });
        }

        if (filters.search) {
            query.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${filters.search}%` });
        }

        // Pagination
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 12;
        const skip = (page - 1) * limit;

        const [items, total] = await query
            .orderBy('product.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getProductBySlug(slug: string) {
        return await this.productRepository.findOne({ 
            where: { slug },
            relations: ['category']
        });
    }

    async createProduct(data: any) {
        const product = this.productRepository.create(data);
        return await this.productRepository.save(product);
    }

    async updateProduct(id: number, data: any) {
        await this.productRepository.update(id, data);
        return await this.productRepository.findOne({ where: { id }, relations: ['category'] });
    }

    async deleteProduct(id: number) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (product) {
            for (const imageUrl of product.images) {
                const publicId = imageUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            return await this.productRepository.remove(product);
        }
        throw new Error('Product not found');
    }

    async uploadImages(files: any[]) {
        const uploadPromises = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'kiran-handicraft' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result!.secure_url);
                    }
                );
                stream.end(file.buffer);
            });
        });

        return await Promise.all(uploadPromises);
    }
}
