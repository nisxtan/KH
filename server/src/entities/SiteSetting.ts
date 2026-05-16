import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSetting {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    key!: string;

    @Column({ type: 'text' })
    value!: string;

    @Column()
    section!: string; // 'hero' | 'about' | 'contact' | 'general'

    @Column()
    label!: string; // Human-readable label for admin form

    @Column({ default: 'text' })
    type!: string; // 'text' | 'textarea' | 'image'

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
