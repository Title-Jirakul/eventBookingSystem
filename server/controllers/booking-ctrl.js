const Booking = require('../models/booking-model')

createBooking = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a movie',
        })
    }

    const booking = new Booking(body)

    if (!booking) {
        return res.status(400).json({ success: false, error: err })
    }

    booking
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: booking._id,
                message: 'Booking created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Booking not created!',
            })
        })
}

updateBooking = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Booking.findOne({ _id: req.params.id }, (err, booking) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Booking not found!',
            })
        }
        booking.name = body.name
        booking.time = body.time
        booking.rating = body.rating
        booking
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: booking._id,
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

deleteBooking = async (req, res) => {
    await Booking.findOneAndDelete({ _id: req.params.id }, (err, booking) => {
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

getBookingById = async (req, res) => {
    await Booking.findOne({ _id: req.params.id }, (err, booking) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!booking) {
            return res
                .status(404)
                .json({ success: false, error: `Booking not found` })
        }
        return res.status(200).json({ success: true, data: movie })
    }).catch(err => console.log(err))
}

getBookings = async (req, res) => {
    await Booking.find({}, (err, bookings) => {
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
    createBooking,
    updateBooking,
    deleteBooking,
    getBookings,
    getBookingById,
}