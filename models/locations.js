module.exports = (sequelize_config, Sequelize) => {
  const Location = sequelize_config.define("location", {
    locationId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    regionName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    latitude: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    longitude: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    altitude: {
      type: Sequelize.FLOAT,
      allowNull: true // can be optional
    },
    soilType: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });

  return Location;
};
