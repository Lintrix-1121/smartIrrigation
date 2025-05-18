const {Router} = require("express");

module.exports = app => {
    const crop_controller = require ('../controllers/crops.controller');
    var router = require("express").Router();

    router.post('/crop', crop_controller.CropData);
    router.get('/crops', crop_controller.GetData);

    app.use('/api', router);
}
