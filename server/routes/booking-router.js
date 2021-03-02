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

router.post('/pass', CustomerPassCtr.createPass)
router.put('/pass/:id', CustomerPassCtr.updatePass)
router.delete('/pass/:id', CustomerPassCtr.deletePass)
router.get('/pass/:id', CustomerPassCtr.getPassByReservationId)
router.get('/passes', CustomerPassCtr.getPasses)

module.exports = router