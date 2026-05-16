import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import slugify from 'slugify';
import { Category } from './Category';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    slug!: string;

    @Column('text')
    description!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @Column()
    size!: string;

    @Column()
    material!: string;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category!: Category;

    @Column({ nullable: true })
    categoryId?: number;

    @Column('simple-array')
    images!: string[];

    @Column({ default: false })
    featured!: boolean;

    @Column({ default: true })
    available!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @BeforeInsert()
    generateSlug() {
        if (this.name) {
            this.slug = slugify(this.name, { lower: true, strict: true });
        }
    }
}
