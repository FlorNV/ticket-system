import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import passportMiddleware from './middlewares/passport'
import passport from 'passport'
import passportLocal from 'passport-local'
import { userRoutes, eventRoutes } from './routes/index'

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//Agregar para jwt
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
passport.use(passportMiddleware);

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventRoutes)

export default app