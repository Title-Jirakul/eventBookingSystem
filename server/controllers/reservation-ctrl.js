const Reservation = require('../models/reservation-model')

createReservation = async (req, res) => {
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

    await Reservation.find({ reservationNo:  reservation.reservationNo}, (err, reservations) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        for (let x of reservations) {
            if (x.date === reservation.date) {
                const [startTime, endTime] = x.time.split(" - ");
                const [newStartTime, newEndTime] = reservation.time.split(" - ");
                const startTime1 = timeToMinutes(startTime);
                const startTime2 = timeToMinutes(newStartTime);
                const endTime1 = timeToMinutes(endTime);
                const endTime2 = timeToMinutes(newEndTime);
                if (startTime1 < endTime2 && startTime2 < endTime1) {
                    return res.status(400).json({
                        success: false,
                        message: 'Have another class overlapping',
                    })
                }
            }
        }
    }).catch(err => console.log(err)) 

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
        reservation.phoneNo = body.phoneNo
        reservation.name = body.name
        reservation.lastName = body.lastName
        reservation.roomID = body.roomID
        reservation.instructor = body.instructor
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

deleteReservationsByRoomID = async (req, res) => {
    await Reservation.deleteMany({ roomID: req.params.id }, (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true})
    }).catch(err => console.log(err))
}

getReservationByReservationNo = async (req, res) => {
    await Reservation.find({ reservationNo: req.params.id }, (err, reservations) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!reservations.length) {
            return res
                .status(404)
                .json({ success: false, error: `Booking not found` })
        }
        return res.status(200).json({ success: true, data: reservations })
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

getReservationById = async (req, res) => {
    await Reservation.findOne({ _id: req.params.id }, (err, reservation) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!reservation) {
            return res
                .status(404)
                .json({ success: false, error: `reservation not found` })
        }
        return res.status(200).json({ success: true, data: reservation })
    }).catch(err => console.log(err))
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

module.exports = {
    createReservation,
    updateReservation,
    deleteReservation,
    deleteReservationsByRoomID,
    getReservations,
    getReservationByReservationNo,
    getReservationById,
}
