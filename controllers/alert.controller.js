const db = require("../models");
const Alert = db.alert;
const { Op } = require("sequelize");

// --- POST: receive alert from ESP32 (already defined) ---
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
    // Optionally emit via WebSocket / Firebase
    res.json({ status: "received" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- GET: fetch alerts with optional filters ---
exports.getAlerts = async (req, res) => {
  try {
    const {
      plot,          // 'A', 'B', 'C' – optional
      resolved,      // 'true' or 'false' – optional
      startDate,
      endDate,
      limit = 50,
      offset = 0
    } = req.query;

    const whereClause = {};

    if (plot) {
      whereClause.plot = plot;
    }

    if (resolved !== undefined) {
      whereClause.resolved = (resolved === 'true');
    }

    if (startDate && endDate) {
      whereClause.timestamp = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.timestamp = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.timestamp = { [Op.lte]: new Date(endDate) };
    }

    const data = await Alert.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['timestamp', 'DESC']]
    });

    res.json({
      status: "success",
      result: data.rows,
      total: data.count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// --- PUT: mark an alert as resolved ---
exports.resolveAlert = async (req, res) => {
  const { id } = req.params;
  try {
    const alert = await Alert.findByPk(id);
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }
    alert.resolved = true;
    await alert.save();
    res.json({ status: "success", message: "Alert resolved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// const db = require("../models");
// const Alert = db.alert;

// exports.receiveAlert = async (req, res) => {
//   const { plot, type, value, timestamp } = req.body;
//   if (!plot || !type || !timestamp) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }
//   try {
//     await Alert.create({
//       plot,
//       type,
//       value: value || 0,
//       timestamp: new Date(timestamp),
//       resolved: false
//     });
//     // Optionally emit via WebSocket or Firebase
//     res.json({ status: "received" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };