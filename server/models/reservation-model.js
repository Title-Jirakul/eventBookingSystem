const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Reservations = new Schema(
    {
        reservationNo: { type: String, required: true },
        name: {type: String, required: false},
        lastName: {type: String, required: false},
        time: { type: String, required: true },
        date: { type: String, required: true },
        roomNo: { type: String, required: true },
        phoneNo: { type: String, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('reservations', Reservations)