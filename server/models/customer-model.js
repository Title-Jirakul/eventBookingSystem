const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomersPass = new Schema(
    {
        reservationNo: { type: String, required: true },
        name: { type: String, required: true },
        passType: { type: String, required: true },
        dateIssued: { type: String, required: true },
        isActive: { type: Boolean, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('customersPass', CustomersPass)