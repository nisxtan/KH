import { AppDataSource } from '../database/data-source';
import { Product } from '../entities/Product';
import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../config/env';
import { getTranslation } from '../utils/translator';

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
});

function getLevenshteinDistance(a: string, b: string): number {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

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

    async getSuggestions(searchQuery: string, lang: string) {
        const products = await this.productRepository.find({
            relations: ['category']
        });

        const q = (searchQuery || '').trim().toLowerCase();
        if (!q) {
            // Return top 5 featured/newest products as recommended
            const recommended = products.slice(0, 5);
            return await Promise.all(recommended.map(async (p) => {
                let name = p.name;
                let categoryName = p.category?.name || '';
                if (lang !== 'en' && ['fr', 'zh', 'de', 'es', 'ne'].includes(lang)) {
                    name = await getTranslation('product', p.id, 'name', p.name, lang);
                    if (p.category) {
                        categoryName = await getTranslation('category', p.category.id, 'name', p.category.name, lang);
                    }
                }
                return {
                    id: p.id,
                    name,
                    slug: p.slug,
                    price: p.price,
                    image: p.images[0] || null,
                    category: categoryName
                };
            }));
        }

        const scored = await Promise.all(products.map(async (p) => {
            let name = p.name;
            let categoryName = p.category?.name || '';
            if (lang !== 'en' && ['fr', 'zh', 'de', 'es', 'ne'].includes(lang)) {
                name = await getTranslation('product', p.id, 'name', p.name, lang);
                if (p.category) {
                    categoryName = await getTranslation('category', p.category.id, 'name', p.category.name, lang);
                }
            }

            const nLower = name.toLowerCase();
            let score = 0;

            // 1. Exact match
            if (nLower === q) score += 1000;

            // 2. Prefix match
            if (nLower.startsWith(q)) score += 500;

            // 3. Word starts with match
            const words = nLower.split(/\s+/);
            const qWords = q.split(/\s+/);
            
            for (const word of words) {
                if (word.startsWith(q)) {
                    score += 200;
                }
                // Check fuzzy matching for each query word against each product name word
                for (const qw of qWords) {
                    if (qw.length > 2 && word.length > 2) {
                        const dist = getLevenshteinDistance(qw, word);
                        if (dist === 0) score += 150;
                        else if (dist === 1) score += 80;
                        else if (dist === 2) score += 40;
                    }
                }
            }

            // 4. Substring match
            if (nLower.includes(q)) score += 100;

            return {
                product: {
                    id: p.id,
                    name,
                    slug: p.slug,
                    price: p.price,
                    image: p.images[0] || null,
                    category: categoryName
                },
                score
            };
        }));

        // Filter and sort by score
        return scored
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map(item => item.product);
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
                        else {
                            resolve(result!.secure_url);
                        }
                    }
                );
                stream.end(file.buffer);
            });
        });

        return await Promise.all(uploadPromises);
    }
}
