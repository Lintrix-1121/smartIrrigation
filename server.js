const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use (bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = require("./models");
const {Sequelize} = require('./config/dbConfig.js')

db.sequelize_config.sync(
    {force: false}
).then(() =>{
    console.log("Re-sync success")
})

require("./routes/users.route.js")(app);
require("./routes/crop.routes.js")(app);
require("./routes/soil.route.js")(app);
require("./routes/irrigationMethods.route.js")(app);
require("./routes/location.route.js")(app);
require("./routes/schedule.route.js")(app);
require("./routes/embedded.routes.js")(app);

app.listen(1900, () => {
    console.log("Fuel server on set");
});