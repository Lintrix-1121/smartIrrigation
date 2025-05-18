
const db = require("../models");
const Soil = db.soil;
const { Op } = require("sequelize");
// const soil = require("../models/soil");

exports.SoilData = (req, res) => {
    const IrrignMtd = {
        soilType: req.body.soilType,
        fieldCapacity: req.body.fieldCapacity,
        wiltingPoint: req.body.wiltingPoint,
        availableWaterConent: req.body.availableWaterConent,
        infiltrationRate: req.body.infiltrationRate
        
    };

    Soil.create(IrrignMtd)
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
    Soil.findAll()
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

