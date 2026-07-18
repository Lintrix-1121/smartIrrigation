const db = require("../models");
const Alert = db.alert;

exports.receiveAlert = async (req, res) => {
  const { plot, type, value, timestamp } = req.body;
  if (!plot || !type || !timestamp) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    await Alert.create({
      plot,
      type,
      value: value || 0,
      timestamp: new Date(timestamp),
      resolved: false
    });
    // Optionally emit via WebSocket or Firebase
    res.json({ status: "received" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};