module.exports = (sequelize_config, Sequelize) => {
    const user = sequelize_config.define("user", {
        userId: {type: Sequelize.INTEGER, allowNull:false},
        userName: {type: Sequelize.STRING, allowNull: false},
        email: {type: Sequelize.STRING, allowNull: false},
        password: {type: Sequelize.STRING, allowNull: false},
        location: {type: Sequelize.STRING, allowNull: false},
        userType: {type: Sequelize.ENUM("Admin", "Farmer")}
    });
    return user;
}