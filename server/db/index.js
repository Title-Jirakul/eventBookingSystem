const mongoose = require('mongoose')

// const mongoURL = 'mongodb://127.0.0.1:27017/booking'
const mongoURL = process.env.MONGODB_URI

mongoose
    .connect(mongoURL, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db