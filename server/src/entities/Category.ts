import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import slugify from 'slugify';
import { Product } from './Product';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ unique: true })
    slug!: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => Product, (product) => product.category)
    products!: Product[];

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
