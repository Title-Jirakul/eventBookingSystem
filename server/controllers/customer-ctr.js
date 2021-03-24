const CustomerPass = require('../models/customer-model')

createPass = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a customer pass',
        })
    }

    const booking = new CustomerPass(body)

    if (!booking) {
        return res.status(400).json({ success: false, error: err })
    }

    booking
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: booking._id,
                message: 'Customer pass created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Customer pass not created!',
            })
        })
}

updatePass = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    CustomerPass.findOne({ _id: req.params.id }, (err, pass) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Booking not found!',
            })
        }
        pass.reservationNo = body.reservationNo
        pass.name = body.name
        pass.passType = body.passType
        pass.phoneNo = body.phoneNo
        pass.isActive = body.isActive
        pass
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: pass._id,
                    message: 'Booking updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Booking not updated!',
                })
            })
    })
}

deletePass = async (req, res) => {
    await CustomerPass.findOneAndDelete({ _id: req.params.id }, (err, booking) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!booking) {
            return res
                .status(404)
                .json({ success: false, error: `Booking not found` })
        }

        return res.status(200).json({ success: true, data: booking })
    }).catch(err => console.log(err))
}

getPassByReservationId = async (req, res) => {
    await CustomerPass.findOne({ reservationNo: req.params.id }, (err, booking) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!booking) {
            return res
                .status(404)
                .json({ success: false, error: `Booking not found` })
        }
        return res.status(200).json({ success: true, data: booking })
    }).catch(err => console.log(err))
}

getPassById = async (req, res) => {
    await CustomerPass.findOne({ _id: req.params.id }, (err, booking) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!booking) {
            return res
                .status(404)
                .json({ success: false, error: `Booking not found` })
        }
        return res.status(200).json({ success: true, data: booking })
    }).catch(err => console.log(err))
}

getPasses = async (req, res) => {
    await CustomerPass.find({}, (err, bookings) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!bookings.length) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: bookings })
    }).catch(err => console.log(err))
}

module.exports = {
    createPass,
    updatePass,
    deletePass,
    getPasses,
    getPassById,
    getPassByReservationId,
}