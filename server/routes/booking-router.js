const express = require('express')

const BookingCtrl = require('../controllers/booking-ctrl')
const RoomCtrl = require('../controllers/room-ctr')
const CustomerPassCtr = require('../controllers/customer-ctr')

const router = express.Router()

router.post('/booking', BookingCtrl.createBooking)
router.put('/booking/:id', BookingCtrl.updateBooking)
router.delete('/booking/:id', BookingCtrl.deleteBooking)
router.get('/booking/:id', BookingCtrl.getBookingById)
router.get('/bookings', BookingCtrl.getBookings)

router.post('/room', RoomCtrl.createRoom)
router.put('/room/:id', RoomCtrl.updateRoom)
router.delete('/room/:id', RoomCtrl.deleteRoom)
router.get('/rooms/:id', RoomCtrl.getRoomByDate)
router.get('/rooms', RoomCtrl.getRooms)

router.post('/room', CustomerPassCtr.createPass)
router.put('/room/:id', CustomerPassCtr.updatePass)
router.delete('/room/:id', CustomerPassCtr.deletePass)
router.get('/rooms/:id', CustomerPassCtr.getPassByReservationId)
router.get('/rooms', CustomerPassCtr.getPasses)

module.exports = router