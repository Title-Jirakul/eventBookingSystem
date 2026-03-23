const AppSetting = require('../models/app-setting-model')

getAppSettings = async (_req, res) => {
    try {
        let settings = await AppSetting.findOne({})

        if (!settings) {
            settings = await AppSetting.create({ allowReservations: true })
        }

        return res.status(200).json({ success: true, data: settings })
    } catch (error) {
        return res.status(400).json({ success: false, error })
    }
}

updateReservationAvailability = async (req, res) => {
    const { allowReservations } = req.body

    if (typeof allowReservations !== 'boolean') {
        return res.status(400).json({
            success: false,
            error: 'allowReservations must be a boolean',
        })
    }

    try {
        const settings = await AppSetting.findOneAndUpdate(
            {},
            { allowReservations },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )

        return res.status(200).json({ success: true, data: settings })
    } catch (error) {
        return res.status(400).json({ success: false, error })
    }
}

module.exports = {
    getAppSettings,
    updateReservationAvailability,
}
