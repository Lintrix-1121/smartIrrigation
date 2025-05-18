module.exports = (sequelize_config, Sequelize) => {
    const irrignMtd = sequelize_config.define("irrignMtd", {
        methodId: {type: Sequelize.INTEGER, allowNull:false},
        methodName: {type: Sequelize.STRING, allowNull: false},
        efficiency: {type: Sequelize.STRING, allowNull: false},
       
    });
    return irrignMtd;
}