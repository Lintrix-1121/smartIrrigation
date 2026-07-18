module.exports = (sequelize, Sequelize) => {
  const PlotConfig = sequelize.define("plot_configs", {
    plot: {
      type: Sequelize.ENUM('A','B','C'),
      allowNull: false,
      primaryKey: true
    },
    cropName: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Cabbage"
    },
    stageName: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Initial"
    }
  }, {
    timestamps: true
  });
  return PlotConfig;
};