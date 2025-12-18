const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomNo = new Schema(
    {
        roomNo: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('roomNumbers', RoomNo)