import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column()
    name: string
    
    @Column()
    date: Date

    @Column()
    gps: string
}