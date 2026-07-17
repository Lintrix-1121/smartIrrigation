const {Router} = require("express");

module.exports = app => {
    const methods_controller = require ('../controllers/irrigationMethods.controller');
    var router = require("express").Router();

    router.post('/method', methods_controller.MethodData);
    router.get('/mtds', methods_controller.GetData);

    app.use('/api', router);
}
