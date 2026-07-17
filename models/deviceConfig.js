// models/deviceConfig.model.js
module.exports = (sequelize_config, Sequelize) => {
    const DeviceConfig = sequelize_config.define("device_config", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        cropName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "Cabbage"   // fallback default
        },
        stageName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "Initial"   // fallback default
        }
    }, {
        // Ensure only one record exists (you can also enforce via unique constraint)
        timestamps: true
    });

    return DeviceConfig;
};