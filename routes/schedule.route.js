const {Router} = require("express");

module.exports = app => {
    const schedule_controller = require ('../controllers/schedule.controller');
    var router = require("express").Router();

    router.post('/schedule', schedule_controller.createSchedule);
    router.get('/schedules', schedule_controller.getAllSchedules);
    router.get('/schedcrop', schedule_controller.getSchedulesByCrop);
    router.get('/schedate', schedule_controller.getSchedulesByDateRange);
    router.get('/schedloc', schedule_controller.getSchedulesByLocation);

    app.use('/api', router);
}
