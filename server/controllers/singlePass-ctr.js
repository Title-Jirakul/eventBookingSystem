const Pass = require('../models/singlePass-model')

createSinglePass = (req, res) => {
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
                message: 'single pass created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'single pass not created!',
            })
        })
}

updateSinglePassUsed = async (req, res) => {
    Pass.findOne({ reservationID: req.params.id }, (err, pass) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Single pass not found!',
            })
        }
        pass.isUsed = !pass.isUsed
        pass
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: pass._id,
                    message: 'Single pass updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Single pass not updated!',
                })
            })
    })
}

deleteSinglePass = async (req, res) => {
    await Pass.findOneAndDelete({ reservationID: req.params.id }, (err, pass) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!pass) {
            return res
                .status(404)
                .json({ success: false, error: `Single pass not found` })
        }

        return res.status(200).json({ success: true, data: pass })
    }).catch(err => console.log(err))
}

getSinglePass = async (req, res) => {
    await Pass.findOne({ reservationID: req.params.id }, (err, pass) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!pass) {
            return res
                .status(404)
                .json({ success: false, error: `Single pass not found` })
        }
        return res.status(200).json({ success: true, data: pass })
    }).catch(err => console.log(err))
}

module.exports = {
    createSinglePass,
    updateSinglePassUsed,
    deleteSinglePass,
    getSinglePass,
}