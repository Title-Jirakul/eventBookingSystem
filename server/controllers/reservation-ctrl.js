const mongoose = require('mongoose')
const Reservation = require('../models/reservation-model')
const AppSetting = require('../models/app-setting-model')
const Room = require('../models/room-model')
const CustomerPass = require('../models/customer-model')
const DayPass = require('../models/dayPass-model')
const SinglePass = require('../models/singlePass-model')

createReservation = async (req, res) => {
    const settings = await AppSetting.findOne({})

    if (settings && settings.allowReservations === false) {
        return res.status(403).json({
            success: false,
            message: 'Reservations are currently disabled.',
        })
    }

    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a reservation detail',
        })
    }

    const reservation = new Reservation(body)

    if (!reservation) {
        return res.status(400).json({ success: false, error: 'Reservation not created' })
    }

    const session = await mongoose.startSession()

    try {
        let createdReservation = null

        await session.withTransaction(async () => {
            const pass = await CustomerPass.findOne({
                reservationNo: reservation.reservationNo,
            }).session(session)

            if (!pass) {
                const error = new Error('Pass not exist, please try a different pass')
                error.code = 'PASS_NOT_FOUND'
                throw error
            }

            if (!pass.isActive) {
                const error = new Error('Pass is not active, please try a different pass')
                error.code = 'PASS_INACTIVE'
                throw error
            }

            const isVirtual = isVirtualPassType(pass.passType)

            await validateAndConsumePass({
                pass,
                date: reservation.date,
                isVirtual,
                session,
            })

            const reservations = await Reservation.find({
                reservationNo: reservation.reservationNo,
                date: reservation.date,
            }).session(session)

            for (let x of reservations) {
                const [startTime, endTime] = x.time.split(" - ")
                const [newStartTime, newEndTime] = reservation.time.split(" - ")
                const startTime1 = timeToMinutes(startTime)
                const startTime2 = timeToMinutes(newStartTime)
                const endTime1 = timeToMinutes(endTime)
                const endTime2 = timeToMinutes(newEndTime)

                if (startTime1 < endTime2 && startTime2 < endTime1) {
                    const error = new Error('Have another class overlapping')
                    error.code = 'OVERLAP'
                    throw error
                }
            }

            const roomQuery = isVirtual
                ? {
                    _id: reservation.roomID,
                    $expr: { $lt: ['$virtualCapacity', '$maxVirtualCapacity'] },
                }
                : {
                    _id: reservation.roomID,
                    $expr: { $lt: ['$capacity', '$maxCapacity'] },
                }

            const roomUpdate = isVirtual
                ? { $inc: { virtualCapacity: 1 } }
                : { $inc: { capacity: 1 } }

            const updatedRoom = await Room.findOneAndUpdate(
                roomQuery,
                roomUpdate,
                { new: true, session }
            )

            if (!updatedRoom) {
                const error = new Error(isVirtual ? 'Virtual class is full' : 'Class is full')
                error.code = 'ROOM_FULL'
                throw error
            }

            createdReservation = await reservation.save({ session })
        })

        return res.status(201).json({
            success: true,
            id: createdReservation._id,
            message: 'Reservation created!',
        })
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This reservation already exists for the selected class.',
            })
        }

        if (error && ['PASS_NOT_FOUND', 'PASS_INACTIVE', 'PASS_INVALID'].includes(error.code)) {
            return res.status(400).json({
                success: false,
                message: error.message,
            })
        }

        if (error && error.code === 'OVERLAP') {
            return res.status(400).json({
                success: false,
                message: error.message,
            })
        }

        if (error && error.code === 'ROOM_FULL') {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

        return res.status(400).json({
            success: false,
            error,
            message: 'Reservation not created!',
        })
    } finally {
        await session.endSession()
    }
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

deleteAllReservations = async (req, res) => {
    try {
        await Reservation.deleteMany({})
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(400).json({ success: false, error })
    }
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

async function validateAndConsumePass({ pass, date, isVirtual, session }) {
    switch (pass.passType) {
        case 'class':
            if (isVirtual) {
                throwPassError('This pass cannot be used for a virtual class.')
            }
            await consumeSinglePass(pass._id, session)
            return
        case 'vclass':
            if (!isVirtual) {
                throwPassError('This pass can only be used for a virtual class.')
            }
            await consumeSinglePass(pass._id, session)
            return
        case 'one':
            if (isVirtual) {
                throwPassError('This pass cannot be used for a virtual class.')
            }
            await consumeDayPass(pass._id, date, 0, `single day pass cannot be used on ${date}`, session)
            return
        case 'vone':
            if (!isVirtual) {
                throwPassError('This pass can only be used for a virtual class.')
            }
            await consumeDayPass(pass._id, date, 0, `Virtual single day pass cannot be used on ${date}`, session)
            return
        case 'two':
            await consumeDayPass(pass._id, date, 1, 'Please select a class within 2 days of the initial booking time', session)
            return
        case 'three':
            await consumeDayPass(pass._id, date, 2, 'Please select a class within 3 days of the initial booking time', session)
            return
        case 'seven':
            await consumeDayPass(pass._id, date, 6, 'Please select a class within 7 days of the initial booking time', session)
            return
        default:
            throwPassError('Unsupported pass type.')
    }
}

async function consumeSinglePass(passId, session) {
    let singlePass = await SinglePass.findOne({ reservationID: String(passId) }).session(session)

    if (!singlePass) {
        singlePass = new SinglePass({ reservationID: String(passId), isUsed: true })
        await singlePass.save({ session })
        return
    }

    if (singlePass.isUsed) {
        throwPassError('Single pass has been used')
    }

    singlePass.isUsed = true
    await singlePass.save({ session })
}

async function consumeDayPass(passId, date, allowedDaysDifference, invalidMessage, session) {
    let dayPass = await DayPass.findOne({ reservationID: String(passId) }).session(session)

    if (!dayPass) {
        dayPass = new DayPass({ reservationID: String(passId), dateBooked: date })
        await dayPass.save({ session })
        return
    }

    if (dayPass.dateBooked === date) {
        return
    }

    if (dayPass.dateBooked === ' ') {
        dayPass.dateBooked = date
        await dayPass.save({ session })
        return
    }

    if (allowedDaysDifference === 0) {
        throwPassError(invalidMessage)
    }

    const dateBooked = new Date(dayPass.dateBooked)
    const roomDate = new Date(date)
    const differenceInTime = Math.abs(dateBooked.getTime() - roomDate.getTime())
    const differenceInDays = differenceInTime / (1000 * 3600 * 24)

    if (differenceInDays > allowedDaysDifference) {
        throwPassError(invalidMessage)
    }
}

function throwPassError(message) {
    const error = new Error(message)
    error.code = 'PASS_INVALID'
    throw error
}

function isVirtualPassType(passType) {
    return passType === 'vclass' || passType === 'vone'
}

module.exports = {
    createReservation,
    updateReservation,
    deleteReservation,
    deleteReservationsByRoomID,
    deleteAllReservations,
    getReservations,
    getReservationByReservationNo,
    getReservationById,
}
