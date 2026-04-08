const db = require("../models");
const Location = db.location; 
const { Op } = require("sequelize");

exports.saveLocation = (req, res) => {
    const locationData = {
        regionName: req.body.regionName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        altitude: req.body.altitude,
        soilType: req.body.soilType
    };

    Location.create(locationData)
        .then(data => {
            res.status(200).send({
                status: "success",
                status_code: 200,
                result: data
            });
        })
        .catch(err => {
            res.status(500).send({
                status: "error",
                status_code: 500,
                message: err.message || "Error saving location data"
            });
        });
};


exports.getAllLocations = (req, res) => {
    Location.findAll()
        .then(data => {
            res.status(200).send({
                status: "success",
                status_code: 200,
                message: "Location data retrieved successfully",
                result: data
            });
        })
        .catch(err => {
            res.status(500).send({
                status: "error",
                status_code: 500,
                message: err.message || "Failed to retrieve location data"
            });
        });
};
