module.exports = app => {
    const locationController = require("../controllers/locations.controller.js");

    const router = require("express").Router();

    router.post("/location", locationController.saveLocation);
    router.get("/locations", locationController.getAllLocations);

    app.use("/api", router);
};
