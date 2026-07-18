const { Router } = require("express");
const cropController = require("../controllers/crops.controller");
const configController = require("../controllers/plotConfig.controller");
//const sensorController = require("../controllers/sensorData.controller");
const alertController = require("../controllers/alert.controller");

module.exports = app => {
  const router = Router();

  // Crop management (existing)
  router.post('/crop', cropController.CropData);
  router.get('/crops', cropController.GetData);

  // Plot configuration
  router.get('/config', configController.getConfig);
  router.post('/config', configController.updateConfig);

  // Sensor data
  //router.post('/sensor-data', sensorController.postSensorData);

  // Alerts
  router.post('/alert', alertController.receiveAlert);

  app.use('/api', router);
};



// const { Router } = require("express");

// module.exports = app => {
//     const crop_controller = require('../controllers/crops.controller');
//     const config_controller = require('../controllers/deviceConfig.controller'); // <-- new

//     var router = require("express").Router();

//     // Existing routes
//     router.post('/crop', crop_controller.CropData);
//     router.get('/crops', crop_controller.GetData);

//     // New config routes
//     router.get('/config', config_controller.getConfig);
//     router.post('/config', config_controller.updateConfig);

//     app.use('/api', router);
// };