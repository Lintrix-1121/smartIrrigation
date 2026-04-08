module.exports = (sequelize_config, Sequelize) => {
    const schedule = sequelize_config.define("schedule", {
        scheduleId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        crop: {
            type: Sequelize.STRING,
            allowNull: false
        },
        growthStage: {
            type: Sequelize.STRING,
            allowNull: false
        },
        plantingDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        latitude: {
            type: Sequelize.DECIMAL(10, 6),
            allowNull: false
        },
        longitude: {
            type: Sequelize.DECIMAL(10, 6),
            allowNull: false
        },
        soilMoisture: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Soil moisture percentage'
        },
        evapotranspiration: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
            comment: 'ET value in mm/day'
        },
        rainfall: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Rainfall in mm'
        },
        cropCoefficient: {
            type: Sequelize.DECIMAL(3, 2),
            allowNull: false,
            comment: 'Kc value for current growth stage'
        },
        cropWaterNeed: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Calculated crop water need in mm'
        },
        irrigationNeed: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Recommended irrigation amount in mm'
        },
        needsIrrigation: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            comment: 'Whether irrigation is recommended'
        },
        recommendationDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        moistureStatus: {
            type: Sequelize.STRING(20),
            allowNull: false,
            comment: 'Low/Moderate/Adequate'
        }
    }, {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });

    return schedule;
};