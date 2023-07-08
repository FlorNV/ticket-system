import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// La relacion no está indicada. Se realiza de un solo lado.
@Entity()
export class Profile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    gender: string

    @Column()
    photo: string //una URL de la foto
}