const express = require('express')

const ReservationCtrl = require('../controllers/reservation-ctrl')
const RoomCtrl = require('../controllers/room-ctr')
const CustomerPassCtr = require('../controllers/customer-ctr')

const router = express.Router()

router.post('/reservation', ReservationCtrl.createReservation)
router.put('/reservation/:id', ReservationCtrl.updateReservation)
router.delete('/reservation/:id', ReservationCtrl.deleteReservation)
router.get('/reservation/:id', ReservationCtrl.getReservationById)
router.get('/reservations', ReservationCtrl.getReservations)

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