const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SinglePasses = new Schema(
    {
        reservationID: { type: String, required: true },
        isUsed: { type: Boolean, required: true, default: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('singlePasses', SinglePasses)