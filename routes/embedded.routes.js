const { Router } = require("express");

module.exports = app => {
    const embedded_controller = require ('../controllers/embedded.controller');
    var router = require("express").Router();

    router.post('/sensor-data', embedded_controller.ReceiveSensorData);
    router.get('/sensor-data', embedded_controller.GetSensorData);
    router.get('/sensor-data/latest', embedded_controller.GetLatestSensorData);

    app.use('/api', router);
}



