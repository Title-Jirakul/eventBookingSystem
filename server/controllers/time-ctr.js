const Time = require('../models/time-model');

const createTime = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a time',
        });
    }

    const time = new Time(body);

    time.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: time._id,
                message: 'time created!',
            });
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'time not created!',
            });
        });
};

const deleteTime = async (req, res) => {
    await Time.findOneAndDelete({ _id: req.params.id }, (err, time) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!time) {
            return res
                .status(404)
                .json({ success: false, error: 'time not found' });
        }

        return res.status(200).json({ success: true, data: time });
    });
};

const getTimes = async (_req, res) => {
    await Time.find({}, (err, times) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!times.length) {
            return res
                .status(404)
                .json({ success: false, error: 'times not found' });
        }
        return res.status(200).json({ success: true, data: times });
    });
};

module.exports = {
    createTime,
    deleteTime,
    getTimes,
};
