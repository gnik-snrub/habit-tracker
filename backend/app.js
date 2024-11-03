const apiRouter = require('./routes/api')

const mongoose = require('mongoose')
const express = require('express')
require('dotenv').config()

mongoose.set('strictQuery', false)
const mongoDB = process.env.MONGO_CT_URL
main().catch(err => console.log(err))
async function main() { await mongoose.connect(mongoDB) }

const compression = require('compression')
const helmet = require('helmet')
const RateLimit = require('express-rate-limit')

const app = express()

app.use(compression())
app.use(helmet())
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
})
app.use(limiter)

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors())

app.use('/', apiRouter)

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
