import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("contact_inquiries")
export class Inquiry {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column({ nullable: true })
    subject!: string;

    @Column("text")
    message!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
