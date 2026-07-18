const db = require("../models");
const PlotConfig = db.plotConfig;

exports.getConfig = async (req, res) => {
  const plot = req.query.plot;
  if (!plot) {
    return res.status(400).json({ error: "Plot parameter required" });
  }
  try {
    let config = await PlotConfig.findByPk(plot);
    if (!config) {
      config = await PlotConfig.create({ plot, cropName: "Cabbage", stageName: "Initial" });
    }
    res.json({ crop: config.cropName, stage: config.stageName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateConfig = async (req, res) => {
  const { plot, cropName, stageName } = req.body;
  if (!plot || !cropName || !stageName) {
    return res.status(400).json({ error: "plot, cropName, stageName required" });
  }
  try {
    let config = await PlotConfig.findByPk(plot);
    if (!config) {
      config = await PlotConfig.create({ plot, cropName, stageName });
    } else {
      config.cropName = cropName;
      config.stageName = stageName;
      await config.save();
    }
    res.json({ status: "success", result: { plot, crop: config.cropName, stage: config.stageName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};