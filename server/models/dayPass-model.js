const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DayPasses = new Schema(
    {
        reservationID: { type: String, required: true },
        dateBooked: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('dayPasses', DayPasses)