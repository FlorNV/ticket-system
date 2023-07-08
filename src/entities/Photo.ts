import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Photo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    // El lado many es Photo y el lado one es User
    @ManyToOne(() => User, (user) => user.photos)
    user: User
}