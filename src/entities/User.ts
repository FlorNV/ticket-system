import { 
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToOne,
    JoinColumn,
    OneToMany
} from 'typeorm'
import { Profile } from './Profile'
import { Photo } from './Photo'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    email: string

    @Column({ select: false })
    password: string

    @Column({ default: true })
    active: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile

    @OneToMany(() => Photo, (photo) => photo.user)
    photos: Photo[]
}