const {Router} = require("express");

module.exports = app => {
    const soil_controller = require ('../controllers/soil.controller');
    var router = require("express").Router();

    router.post('/soil', soil_controller.SoilData);
    router.get('/soils', soil_controller.GetData);

    app.use('/api', router);
}
