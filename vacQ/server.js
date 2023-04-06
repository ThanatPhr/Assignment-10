const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const connectDB = require('./config/db')

const hospitals = require('./routes/hospitals')
const auth = require('./routes/auth')
const appointments = require('./routes/appointments')

const cors = require('cors')

dotenv.config({ path: './config/config.env' })
connectDB()

const app = express()
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
const limiter = rateLimit({ windowsMs: 10 * 60 * 100, max: 100 })

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(mongoSanitize())
app.use(helmet())
app.use(xss())
app.use(limiter)
app.use(hpp())

app.use('/api/v1/hospitals', hospitals)
app.use('/api/v1/appointments', appointments)
app.use('/api/v1/auth', auth)

const PORT = process.env.PORT || 3333

const sever = app.listen(
  PORT,
  console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT)
)

process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`)
  sever.close(() => {
    process.exit(1)
  })
})
