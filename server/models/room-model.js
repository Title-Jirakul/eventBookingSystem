const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Rooms = new Schema(
    {
        roomNo: { type: String, required: true },
        time: { type: String, required: true },
        date: { type: String, required: true },
        capacity: { type: Number, required: true, default: 0 },
        maxCapacity: { type: Number, required: true, default: 30 },
        className: { type: String, required: false },
        instructor: { type: String, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('rooms', Rooms)