import { DataSource } from 'typeorm'
import { User, Event, Profile, Photo } from './entities/index'

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: 'mysql',
    database: 'ticket-system-db',
    // logging: true,
    synchronize: true,
    entities: [User, Profile, Photo, Event]
})