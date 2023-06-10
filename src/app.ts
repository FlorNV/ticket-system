import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { userRoutes, eventRoutes } from './routes/index'

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventRoutes)

export default app