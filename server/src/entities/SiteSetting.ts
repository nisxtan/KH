import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSetting {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    key!: string;

    @Column({ type: 'text' })
    value!: string; // English (default)

    // Add language-specific columns
    @Column({ type: 'text', nullable: true })
    value_fr!: string; // French

    @Column({ type: 'text', nullable: true })
    value_ne!: string; // Nepali

    @Column({ type: 'text', nullable: true })
    value_zh!: string; // Chinese

    @Column({ type: 'text', nullable: true })
    value_de!: string; // German

    @Column({ type: 'text', nullable: true })
    value_es!: string; // Spanish

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