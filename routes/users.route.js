const {Router} = require("express");

module.exports = app => {
    const users_controller = require ('../controllers/user.controller.js');
    var router = require("express").Router();

    router.post('/signup', users_controller.Signup);
    router.post('/login', users_controller.Login);
    router.get('/users', users_controller.GetUsers);
    router.delete('/deluser/:id', users_controller.DeleteUser);

    app.use('/api', router);
}
