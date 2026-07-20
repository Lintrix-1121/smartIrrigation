const dbConfig = require("../config/dbConfig.js");

const Sequelize = require("sequelize");
const sequelize_config = new Sequelize (
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize_config = sequelize_config;

db.users = require("./users.js")(sequelize_config, Sequelize);
db.crops = require("./crops.js")(sequelize_config, Sequelize);
db.irrignMtd = require("./irrigationMethods.js")(sequelize_config, Sequelize);
db.soil = require("./soil.js")(sequelize_config, Sequelize);
db.location = require("./locations.js")(sequelize_config,Sequelize);
db.schedule = require("./schedule.js")(sequelize_config, Sequelize);
 db.embedded = require("./embedded.js")(sequelize_config, Sequelize);
 db.deviceConfig = require("./deviceConfig.js")(sequelize_config, Sequelize);
 db.plotConfig = require("./plotConfig.js")(sequelize_config, Sequelize);
 db.alert = require("./alert.js")(sequelize_config, Sequelize);


module.exports =db;