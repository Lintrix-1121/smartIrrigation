const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const SensorReading = sequelize.define('SensorReading', {
        plot: {
            type: DataTypes.ENUM('A', 'B', 'C'),
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false
        },

        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        moisture: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        temperature: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        conductivity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        pH: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        nitrogen: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        phosphorus: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        potassium: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        weather: {
            type: DataTypes.STRING,
            allowNull: true
        },

        airTemperature: {
            type: DataTypes.FLOAT,
            allowNull: true
        },

        humidity: {
            type: DataTypes.FLOAT,
            allowNull: true
        },

        rainfall: {
            type: DataTypes.FLOAT,
            allowNull: true
        },

        irrigationOn: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        fertilizerOn: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        moistureLow: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },

        nutrientLow: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }

    }, {
        tableName: 'sensor_readings',
        timestamps: true
    });

    return SensorReading;
};


