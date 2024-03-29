const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const bookingRouter = require('./routes/booking-router')

const app = express()
const apiPort = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: "*",
}))
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Connected Successfully!')
})

app.use('/api', bookingRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))