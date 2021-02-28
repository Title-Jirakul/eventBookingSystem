const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Reservations = new Schema(
    {
        reservationNo: { type: String, required: true },
        time: { type: String, required: true },
        date: { type: String, required: true },
        roomNo: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('reservations', Reservations)