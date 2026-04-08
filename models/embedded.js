module.exports = (sequelize, DataTypes) => {
    const SensorReading = sequelize.define('SensorReading', {
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
        moistureLow: {
            type: DataTypes.BOOLEAN,
            allowNull: true   // optional flag, can be computed on the fly
        },
        nutrientLow: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        tableName: 'sensor_readings',
        timestamps: true   // adds createdAt and updatedAt
    });
    return SensorReading;
};




// module.exports = (sequelize, DataTypes) => {
//   const SensorReading = sequelize.define('SensorReading', {
//     moisture: DataTypes.FLOAT,
//     temperature: DataTypes.FLOAT,
//     conductivity: DataTypes.INTEGER,
//     pH: DataTypes.FLOAT,
//     nitrogen: DataTypes.FLOAT,
//     phosphorus: DataTypes.FLOAT,
//     potassium: DataTypes.FLOAT
//   });
//   return SensorReading;
// };