const { Router } = require("express");

module.exports = app => {
    const embedded_controller = require ('../controllers/embedded.controller');
    const alert_controller = require('../controllers/alert.controller');
    var router = require("express").Router();

    router.post('/sensor-data', embedded_controller.ReceiveSensorData);
    router.get('/sensor-data', embedded_controller.GetSensorData);
    router.get('/sensor-data/latest', embedded_controller.GetLatestSensorData);
    router.post('/alert', alert_controller.receiveAlert);
    router.get('/alert', alert_controller.getAlerts);
    router.put('/alert/:id', alert_controller.resolveAlert);

    app.use('/api', router);
}



