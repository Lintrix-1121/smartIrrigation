module.exports = (sequelize_config, Sequelize) => {
    const soil = sequelize_config.define("soil", {
        soilId: {type: Sequelize.INTEGER, allowNull:false},
        soilType: {type: Sequelize.STRING, allowNull: false},
        fieldCapacity: {type: Sequelize.STRING, allowNull: false},
        wiltingPoint: {type: Sequelize.STRING, allowNull: false},
        availableWaterContent: {type: Sequelize.STRING, allowNull: false},
        infiltrationRate: {type: Sequelize.STRING}
    });
    return soil;
}