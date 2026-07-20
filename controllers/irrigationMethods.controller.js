
const db = require("../models");
const Method = db.irrignMtd;
const { Op } = require("sequelize");

exports.MethodData = (req, res) => {
    const IrrignMtd = {
        methodName: req.body.methodName,
        efficiency: req.body.efficiency,
        
    };

    Method.create(IrrignMtd)
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
                message: err.message || "Error saving method"
            });
        });
};


exports.GetData = (req, res) => {
    Method.findAll()
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

