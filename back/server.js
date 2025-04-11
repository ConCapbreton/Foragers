const express = require('express')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const cors = require('cors')

const authRoutes = require('./routes/authRoute')
const {connectDB} = require('./db/connectDB')

dotenv.config()
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors({origin: "http://localhost:5173", credentials: true}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.listen(3000, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
