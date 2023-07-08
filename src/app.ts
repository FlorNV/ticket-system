import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import passportMiddleware from './middlewares/passport'
import passport from 'passport'
import passportLocal from 'passport-local'
import { userRoutes, eventRoutes } from './routes/index'

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./swaggerOptions";

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//Agregar para jwt
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
passport.use(passportMiddleware);

// Conexion con swagger
const specs = swaggerJsDoc(options);
app.use(
    '/docs', // Ruta para la documentación
    swaggerUi.serve,
    swaggerUi.setup(specs)
)

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventRoutes)

export default app