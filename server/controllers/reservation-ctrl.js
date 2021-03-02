const Reservation = require('../models/reservation-model')

createReservation = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a reservation detail',
        })
    }

    const reservation = new Reservation(body)

    if (!reservation) {
        return res.status(400).json({ success: false, error: err })
    }

    reservation
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: reservation._id,
                message: 'Reservation created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Reservation not created!',
            })
        })
}

updateReservation = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Reservation.findOne({ _id: req.params.id }, (err, reservation) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Reservation not found!',
            })
        }
        reservation.reservationNo = body.reservationNo
        reservation.time = body.time
        reservation.date = body.date
        reservation.roomNo = body.roomNo
        reservation
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: reservation._id,
                    message: 'Reservation updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Reseravation not updated!',
                })
            })
    })
}

deleteReservation = async (req, res) => {
    await Reservation.findOneAndDelete({ _id: req.params.id }, (err, reservation) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!reservation) {
            return res
                .status(404)
                .json({ success: false, error: `Booking not found` })
        }

        return res.status(200).json({ success: true, data: reservation })
    }).catch(err => console.log(err))
}

getReservationById = async (req, res) => {
    await Reservation.findOne({ _id: req.params.id }, (err, reservation) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!reservation) {
            return res
                .status(404)
                .json({ success: false, error: `Booking not found` })
        }
        return res.status(200).json({ success: true, data: reservation })
    }).catch(err => console.log(err))
}

getReservations = async (req, res) => {
    await Reservation.find({}, (err, reservations) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!reservations.length) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: reservations })
    }).catch(err => console.log(err))
}

module.exports = {
    createReservation,
    updateReservation,
    deleteReservation,
    getReservations,
    getReservationById,
}