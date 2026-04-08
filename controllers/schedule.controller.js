const db = require("../models");
const Schedule = db.schedule;
const { Op } = require("sequelize");

exports.createSchedule = (req, res) => {
    const scheduleData = {
        crop: req.body.crop,
        growthStage: req.body.growthStage,
        plantingDate: req.body.plantingDate || null,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        soilMoisture: req.body.soilMoisture,
        evapotranspiration: req.body.evapotranspiration,
        rainfall: req.body.rainfall,
        cropCoefficient: req.body.cropCoefficient,
        cropWaterNeed: req.body.cropWaterNeed,
        irrigationNeed: req.body.irrigationNeed,
        needsIrrigation: req.body.needsIrrigation,
        moistureStatus: req.body.moistureStatus
    };

    Schedule.create(scheduleData)
        .then(data => {
            res.status(200).send({
                status: "success",
                status_code: 200,
                message: "Recommendation saved successfully",
                result: data
            });
        })
        .catch(err => {
            res.status(500).send({
                status: "error",
                status_code: 500,
                message: err.message || "Error saving irrigation recommendation"
            });
        });
};

exports.getAllSchedules = (req, res) => {
    Schedule.findAll({
        order: [['recommendationDate', 'DESC']]
    })
    .then(data => {
        res.status(200).send({
            status: "success",
            status_code: 200,
            message: "Schedules retrieved successfully",
            result: data,
            count: data.length
        });
    })
    .catch(err => {
        res.status(500).send({
            status: "error",
            status_code: 500,
            message: err.message || "Error retrieving schedules"
        });
    });
};

exports.getSchedulesByCrop = (req, res) => {
    const crop = req.params.crop;

    Schedule.findAll({
        where: { crop: crop },
        order: [['recommendationDate', 'DESC']]
    })
    .then(data => {
        res.status(200).send({
            status: "success",
            status_code: 200,
            message: `Schedules for ${crop} retrieved successfully`,
            result: data,
            count: data.length
        });
    })
    .catch(err => {
        res.status(500).send({
            status: "error",
            status_code: 500,
            message: err.message || `Error retrieving schedules for ${crop}`
        });
    });
};

// Retrieve recommendations by location (within radius)
exports.getSchedulesByLocation = (req, res) => {
    const { latitude, longitude, radius } = req.params;
    const earthRadius = 6371; // Earth's radius in km

    Schedule.findAll({
        where: sequelize_config.where(
            sequelize_config.fn('ST_Distance_Sphere',
                sequelize_config.col('location'),
                sequelize_config.fn('ST_MakePoint', longitude, latitude)
            ),
            {
                [Op.lte]: radius * 1000 // Convert km to meters
            }
        ),
        order: [['recommendationDate', 'DESC']]
    })
    .then(data => {
        res.status(200).send({
            status: "success",
            status_code: 200,
            message: `Schedules within ${radius}km of location retrieved`,
            result: data,
            count: data.length
        });
    })
    .catch(err => {
        res.status(500).send({
            status: "error",
            status_code: 500,
            message: err.message || "Error retrieving location-based Schedules"
        });
    });
};

// Retrieve recommendations by date range
exports.getSchedulesByDateRange = (req, res) => {
    const { startDate, endDate } = req.params;

    Schedule.findAll({
        where: {
            recommendationDate: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            }
        },
        order: [['recommendationDate', 'DESC']]
    })
    .then(data => {
        res.status(200).send({
            status: "success",
            status_code: 200,
            message: `Schedules between ${startDate} and ${endDate} retrieved`,
            result: data,
            count: data.length
        });
    })
    .catch(err => {
        res.status(500).send({
            status: "error",
            status_code: 500,
            message: err.message || "Error retrieving date-based schedules"
        });
    });
};