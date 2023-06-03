import 'reflect-metadata'
import app from './app'
import { AppDataSource } from './db'

const PORT = 3000

const main = async () => {
    try {
        await AppDataSource.initialize()
        console.log('Database connected ✅')
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} 🚀`)
        })
    } catch (error) {
        console.log(error)
    }
}

main()
