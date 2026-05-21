import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('translations')
@Index(['entityType', 'entityId', 'field', 'language'], { unique: true })
export class Translation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    entityType!: string; // 'product', 'category', 'setting'

    @Column()
    entityId!: string; // product id or setting key

    @Column()
    field!: string; // 'name', 'description', 'value'

    @Column()
    language!: string; // 'fr', 'zh'

    @Column('text')
    translatedText!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
