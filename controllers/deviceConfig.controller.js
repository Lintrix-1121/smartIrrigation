// controllers/deviceConfig.controller.js
const db = require("../models");
const DeviceConfig = db.deviceConfig;

// GET /api/config – returns the active crop and stage
exports.getConfig = async (req, res) => {
    try {
        // Fetch the first (and only) config row
        let config = await DeviceConfig.findOne({
            order: [['id', 'ASC']]  // just in case there are multiple
        });

        // If no row exists, create one with defaults
        if (!config) {
            config = await DeviceConfig.create({
                cropName: "Cabbage",
                stageName: "Initial"
            });
        }

        res.status(200).json({
            crop: config.cropName,
            stage: config.stageName
        });
    } catch (err) {
        console.error("Error fetching config:", err);
        res.status(500).json({
            status: "error",
            status_code: 500,
            message: err.message || "Failed to retrieve config"
        });
    }
};

// POST /api/config – updates the active crop and stage
exports.updateConfig = async (req, res) => {
    const { cropName, stageName } = req.body;

    // Validate input
    if (!cropName || !stageName) {
        return res.status(400).json({
            status: "error",
            status_code: 400,
            message: "cropName and stageName are required"
        });
    }

    try {
        // Find the existing config (or create if missing)
        let config = await DeviceConfig.findOne({
            order: [['id', 'ASC']]
        });

        if (!config) {
            // Create new row
            config = await DeviceConfig.create({ cropName, stageName });
        } else {
            // Update existing
            config.cropName = cropName;
            config.stageName = stageName;
            await config.save();
        }

        res.status(200).json({
            status: "success",
            status_code: 200,
            message: "Configuration updated",
            result: {
                crop: config.cropName,
                stage: config.stageName
            }
        });
    } catch (err) {
        console.error("Error updating config:", err);
        res.status(500).json({
            status: "error",
            status_code: 500,
            message: err.message || "Failed to update config"
        });
    }
};