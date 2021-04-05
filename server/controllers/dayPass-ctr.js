const Pass = require('../models/dayPass-model')

createDayPass = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body',
        })
    }

    const pass = new Pass(body)

    if (!pass) {
        return res.status(400).json({ success: false, error: err })
    }

    pass
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: pass._id,
                message: 'day pass created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'day pass not created!',
            })
        })
}

updateDayPassDate = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Pass.findOne({ reservationID: req.params.id }, (err, pass) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'day pass not found!',
            })
        }
        pass.dateBooked = body.dateBooked
        pass
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: pass._id,
                    message: 'day pass updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'day pass not updated!',
                })
            })
    })
}

deleteDayPass = async (req, res) => {
    await Pass.findOneAndDelete({ reservationID: req.params.id }, (err, pass) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!pass) {
            return res
                .status(404)
                .json({ success: false, error: `day pass not found` })
        }

        return res.status(200).json({ success: true, data: pass })
    }).catch(err => console.log(err))
}

getDayPass = async (req, res) => {
    await Pass.findOne({ reservationID: req.params.id }, (err, pass) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!pass) {
            return res
                .status(404)
                .json({ success: false, error: `day pass not found` })
        }
        return res.status(200).json({ success: true, data: pass })
    }).catch(err => console.log(err))
}

module.exports = {
    createDayPass,
    updateDayPassDate,
    deleteDayPass,
    getDayPass,
}