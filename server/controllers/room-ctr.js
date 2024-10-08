const Room = require('../models/room-model')

createRoom = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a class',
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
                message: 'Class created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Class not created!',
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
                message: 'Class not found!',
            })
        }
        room.roomNo = body.roomNo
        room.time = body.time
        room.date = body.date
        room.maxCapacity = body.maxCapacity
        room.maxVirtualCapacity = body.maxVirtualCapacity
        room.className = body.className
        room.instructor = body.instructor
        room
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: room._id,
                    message: 'Class updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Class not updated!',
                })
            })
    })
}

updateRoomByLessOne = async (req, res) => {
    await Room.findOne({ _id: req.params.id }, (err, room) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Class not found!',
            })
        }
        room.capacity = room.capacity - 1
        room
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: room._id,
                    message: 'Class updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Class not updated!',
                })
            })
    }).catch(err => console.log(err))
}

updateVirtualRoomByLessOne = async (req, res) => {
    Room.findOne({ _id: req.params.id }, (err, room) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Class not found!',
            })
        }
        room.virtualCapacity = room.virtualCapacity - 1
        room
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: room._id,
                    message: 'Class updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Class not updated!',
                })
            })
    })
}

updateRoomByOne = async (req, res) => {
    await Room.findOne({ _id: req.params.id }, (err, room) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Class not found!',
            })
        }
        if (room.capacity + 1 > room.maxCapacity) {
            return res.status(500).json({
                err,
                message: 'Class is full',
            })
        }
        room.capacity = room.capacity + 1
        room
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: room._id,
                    message: 'Class updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Class not updated!',
                })
            })
    }).catch(err => console.log(err))
}

updateVirtualRoomByOne = async (req, res) => {
    Room.findOne({ _id: req.params.id }, (err, room) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Class not found!',
            })
        }
        if (room.virtualCapacity + 1 > room.maxVirtualCapacity) {
            return res.status(500).json({
                err,
                message: 'Virtual class is full',
            })
        }
        room.virtualCapacity = room.virtualCapacity + 1
        room
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: room._id,
                    message: 'Class updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Class not updated!',
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
                .json({ success: false, error: `Class not found` })
        }

        return res.status(200).json({ success: true, data: room })
    }).catch(err => console.log(err))
}

getRoomByDate = async (req, res) => {
    await Room.findOne({ date: req.params.id }, (err, room) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!room) {
            return res
                .status(404)
                .json({ success: false, error: `Class not found` })
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
                .json({ success: false, error: `Classes not found` })
        }
        return res.status(200).json({ success: true, data: rooms })
    }).catch(err => console.log(err))
}

module.exports = {
    createRoom,
    updateRoom,
    updateRoomByOne,
    updateRoomByLessOne,
    updateVirtualRoomByOne,
    updateVirtualRoomByLessOne,
    deleteRoom,
    getRooms,
    getRoomByDate,
}