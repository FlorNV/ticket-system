import { DataSource } from 'typeorm'
import { User, Event } from './entities/index'

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: 'mysql',
    database: 'ticket-system-db',
    // logging: true,
    synchronize: true,
    entities: [User, Event]
})