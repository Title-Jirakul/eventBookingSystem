const Room = require('../models/roomNumber-model')

createRoom = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a roomNo',
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
                message: 'RoomNumber created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'RoomNumber not created!',
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
                .json({ success: false, error: `RoomNumber not found` })
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
                .json({ success: false, error: `RoomNumbers not found` })
        }
        return res.status(200).json({ success: true, data: rooms })
    }).catch(err => console.log(err))
}

module.exports = {
    createRoom,
    deleteRoom,
    getRooms,
}