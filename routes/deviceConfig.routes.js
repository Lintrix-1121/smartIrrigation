const { Router } = require("express");

module.exports = app => {
    const crop_controller = require('../controllers/crops.controller');
    const config_controller = require('../controllers/deviceConfig.controller'); // <-- new

    var router = require("express").Router();

    // Existing routes
    router.post('/crop', crop_controller.CropData);
    router.get('/crops', crop_controller.GetData);

    // New config routes
    router.get('/config', config_controller.getConfig);
    router.post('/config', config_controller.updateConfig);

    app.use('/api', router);
};