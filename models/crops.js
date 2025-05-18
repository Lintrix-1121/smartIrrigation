
module.exports = (sequelize_config, Sequelize) => {
    const crop = sequelize_config.define("crops", {
        cropId: {type: Sequelize.INTEGER, allowNull:false},
        cropName: {type: Sequelize.STRING, allowNull: false},
        kcValue: {type: Sequelize.STRING, allowNull: false},
        growthStage: {type: Sequelize.STRING, allowNull: false},
        rootDepth: {type: Sequelize.STRING, allowNull: false},
        cropDuration: {type: Sequelize.STRING}
    });
    return crop;
}