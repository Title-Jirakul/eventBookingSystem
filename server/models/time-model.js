const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Times = new Schema(
    {
        time: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('times', Times)