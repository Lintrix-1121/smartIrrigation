const db = require("../models");
const Crop = db.crops;
const { Op } = require("sequelize");

exports.CropData = (req, res) => {
    const cropData = {
        cropName: req.body.cropName,
        kcValue: req.body.kcValue,
        growthStage: req.body.growthStage,
        rootDepth: req.body.rootDepth,
        cropDuration: req.body.cropDuration
    };

    Crop.create(cropData)
        .then(data => {
            res.send({
                status: "success",
                status_code: 200,
                result: data
            });
        })
        .catch(err => {
            res.send({
                status: "error",
                status_code: 500,
                message: err.message || "Error saving data"
            });
        });
};


exports.GetData = (req, res) => {
    Crop.findAll()
    .then(data => {
        res.send({
            status: "success",
            status_code: 200,
            message: "Data retrieved success",
            result: data
        });
    })
    .catch(err => {
        res.send({
            status: "Error",
            status_code: 201,
            message: err.message || "Failed to retrieve data"
        });
    });
}

