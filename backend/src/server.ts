import express from 'express'
import dotenv from 'dotenv'
import countryRoutes from './routes/countryRoutes'

dotenv.config()

const app = express()
app.use(express.json())

//Routes
app.use('/api/v1/countries', countryRoutes)

export default app