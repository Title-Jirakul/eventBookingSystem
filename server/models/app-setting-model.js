const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AppSettings = new Schema(
    {
        allowReservations: { type: Boolean, required: true, default: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('appSettings', AppSettings)
