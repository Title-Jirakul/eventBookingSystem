const Room = require('../models/room-model')

createRoom = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a room',
        })
    }

    const room = new Room(body)

    if (!room) {
        return res.status(400).json({ success: false, error: err })
    }

    room
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: room._id,
                message: 'Room created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Room not created!',
            })
        })
}

updateRoom = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Room.findOne({ _id: req.params.id }, (err, room) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Room not found!',
            })
        }
        room.capacity = room.capacity + 1
        room
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: room._id,
                    message: 'Room updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Room not updated!',
                })
            })
    })
}

deleteRoom = async (req, res) => {
    await Room.findOneAndDelete({ _id: req.params.id }, (err, room) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!room) {
            return res
                .status(404)
                .json({ success: false, error: `Room not found` })
        }

        return res.status(200).json({ success: true, data: room })
    }).catch(err => console.log(err))
}

getRoomByDate = async (req, res) => {
    await Room.findOne({ date: req.params.date }, (err, room) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!room) {
            return res
                .status(404)
                .json({ success: false, error: `Room not found` })
        }
        return res.status(200).json({ success: true, data: room })
    }).catch(err => console.log(err))
}

getRooms = async (req, res) => {
    await Room.find({}, (err, rooms) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!rooms.length) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: rooms })
    }).catch(err => console.log(err))
}

module.exports = {
    createRoom,
    updateRoom,
    deleteRoom,
    getRooms,
    getRoomByDate,
}