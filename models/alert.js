module.exports = (sequelize, Sequelize) => {
  const Alert = sequelize.define("alerts", {
    plot: {
      type: Sequelize.ENUM('A','B','C'),
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('moisture_low','nutrient_low'),
      allowNull: false
    },
    value: { type: Sequelize.FLOAT },
    timestamp: { type: Sequelize.DATE, allowNull: false },
    resolved: { type: Sequelize.BOOLEAN, defaultValue: false }
  });
  return Alert;
};