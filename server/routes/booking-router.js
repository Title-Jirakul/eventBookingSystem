const express = require('express')

const ReservationCtrl = require('../controllers/reservation-ctrl')
const RoomCtrl = require('../controllers/room-ctr')
const CustomerPassCtr = require('../controllers/customer-ctr')
const DayPassCtr = require('../controllers/dayPass-ctr')
const SinglePassCtr = require('../controllers/singlePass-ctr')
const RoomNoCtrl = require('../controllers/roomNo-ctr')
const TimeCtrl = require('../controllers/time-ctr')

const router = express.Router()

router.post('/reservation', ReservationCtrl.createReservation)
router.put('/reservation/:id', ReservationCtrl.updateReservation)
router.delete('/reservation/:id', ReservationCtrl.deleteReservation)
router.delete('/reservations/:id', ReservationCtrl.deleteReservationsByRoomID)
router.get('/reservations/:id', ReservationCtrl.getReservationByReservationNo)
router.get('/reservations', ReservationCtrl.getReservations)
router.get('/reservation/:id', ReservationCtrl.getReservationById)

router.post('/room', RoomCtrl.createRoom)
router.put('/room/:id', RoomCtrl.updateRoom)
router.put('/roomByOne/:id', RoomCtrl.updateRoomByOne)
router.put('/roomByLess/:id', RoomCtrl.updateRoomByLessOne)
router.put('/vroomByOne/:id', RoomCtrl.updateVirtualRoomByOne)
router.put('/vroomByLess/:id', RoomCtrl.updateVirtualRoomByLessOne)
router.delete('/room/:id', RoomCtrl.deleteRoom)
router.get('/rooms/:id', RoomCtrl.getRoomByDate)
router.get('/rooms', RoomCtrl.getRooms)

router.post('/pass', CustomerPassCtr.createPass)
router.put('/pass/:id', CustomerPassCtr.updatePass)
router.delete('/pass/:id', CustomerPassCtr.deletePass)
router.get('/pass/:id', CustomerPassCtr.getPassByReservationId)
router.get('/passes/:id', CustomerPassCtr.getPassById)
router.get('/passes', CustomerPassCtr.getPasses)

router.post('/dayPass', DayPassCtr.createDayPass)
router.put('/dayPass/:id', DayPassCtr.updateDayPassDate)
router.delete('/dayPass/:id', DayPassCtr.deleteDayPass)
router.get('/dayPass/:id', DayPassCtr.getDayPass)

router.post('/singlePass', SinglePassCtr.createSinglePass)
router.put('/singlePass/:id', SinglePassCtr.updateSinglePassUsed)
router.delete('/singlePass/:id', SinglePassCtr.deleteSinglePass)
router.get('/singlePass/:id', SinglePassCtr.getSinglePass)

router.post('/roomNo', RoomNoCtrl.createRoom)
router.delete('/roomNo/:id', RoomNoCtrl.deleteRoom)
router.get('/roomNos', RoomNoCtrl.getRooms)

router.post('/time', TimeCtrl.createTime)
router.delete('/time/:id', TimeCtrl.deleteTime)
router.get('/times', TimeCtrl.getTimes)

module.exports = router