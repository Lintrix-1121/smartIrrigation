// const sensorController = require('../controllers/embedded.controller');
// const express = require('express');
// const router = express.Router();

// router.post('/api/sensor-data', sensorController.ReceiveSensorData);
// router.get('/api/sensor-data', sensorController.GetSensorData);
// router.get('/api/sensor-data/latest', sensorController.GetLatestSensorData);

// module.exports = router;


const { Router } = require("express");

module.exports = app => {
    const embedded_controller = require ('../controllers/embedded.controller');
    var router = require("express").Router();

    router.post('/sensor-data', embedded_controller.ReceiveSensorData);
    router.get('/sensor-data', embedded_controller.GetSensorData);
    router.get('/sensor-data/latest', embedded_controller.GetLatestSensorData);

    app.use('/api', router);
}
