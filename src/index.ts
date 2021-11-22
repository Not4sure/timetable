import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import router from './router'
import errorMiddleware from './middlewares/error-middleware'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
    }),
)
app.use(router)
// todo: починить при отсутствии ошибки
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions)
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()