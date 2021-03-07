const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomersPass = new Schema(
    {
        reservationNo: { type: String, required: true },
        name: { type: String, required: true },
        passType: { type: String, required: false },
        phoneNo: { type: String, required: false },
        isActive: { type: Boolean, required: false, default: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('customersPass', CustomersPass)