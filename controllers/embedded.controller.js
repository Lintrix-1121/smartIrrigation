// controllers/sensorController.js

const db = require("../models");
const SensorReading = db.SensorReading;   // Adjust model name as needed
const { Op } = require("sequelize");

// Thresholds for automatic control (adjust according to your needs)
// These could also be stored in a separate Settings table and fetched here.
const MOISTURE_THRESHOLD = 30.0;          // % soil moisture below which irrigation is needed
const N_THRESHOLD = 50.0;                 // mg/kg Nitrogen below which N is low
const P_THRESHOLD = 30.0;                 // mg/kg Phosphorus
const K_THRESHOLD = 100.0;                // mg/kg Potassium

/**
 * Helper to evaluate if soil moisture is low.
 * @param {float} moisture 
 * @returns {boolean}
 */
const isMoistureLow = (moisture) => moisture < MOISTURE_THRESHOLD;

/**
 * Helper to evaluate if any nutrient is low.
 * @param {float} nitrogen
 * @param {float} phosphorus
 * @param {float} potassium
 * @returns {boolean}
 */
const isNutrientLow = (nitrogen, phosphorus, potassium) => {
    return (nitrogen < N_THRESHOLD) ||
           (phosphorus < P_THRESHOLD) ||
           (potassium < K_THRESHOLD);
};

/**
 * POST /api/sensor-data
 * Accepts sensor readings from the ESP32 and stores them.
 * Expected JSON body: 
 * {
 *   "moisture": 45.2,
 *   "temperature": 24.5,
 *   "conductivity": 1234,
 *   "pH": 6.8,
 *   "nitrogen": 70,
 *   "phosphorus": 40,
 *   "potassium": 120
 * }
 */
exports.ReceiveSensorData = (req, res) => {
    // Extract sensor data from request body
    const {
        moisture,
        temperature,
        conductivity,
        pH,
        nitrogen,
        phosphorus,
        potassium
    } = req.body;

    // Validate required fields (all are required)
    if (moisture === undefined || temperature === undefined ||
        conductivity === undefined || pH === undefined ||
        nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
        return res.status(400).send({
            status: "error",
            status_code: 400,
            message: "Missing required sensor data fields"
        });
    }

    // Optionally compute recommendation flags (these can be stored for later analytics)
    const moistureLow = isMoistureLow(moisture);
    const nutrientLow = isNutrientLow(nitrogen, phosphorus, potassium);

    // Create record in the database
    SensorReading.create({
        moisture,
        temperature,
        conductivity,
        pH,
        nitrogen,
        phosphorus,
        potassium,
        moistureLow,      // optional – store flag for quick querying
        nutrientLow       // optional
    })
        .then(data => {
            res.send({
                status: "success",
                status_code: 200,
                message: "Sensor data saved successfully",
                result: {
                    id: data.id,
                    moistureLow,
                    nutrientLow
                }
            });
        })
        .catch(err => {
            console.error("Database error:", err);
            res.status(500).send({
                status: "error",
                status_code: 500,
                message: err.message || "Error saving sensor data"
            });
        });
};

/**
 * GET /api/sensor-data
 * Retrieves all sensor readings (optionally with pagination or date filters).
 */
exports.GetSensorData = (req, res) => {
    // You can add query parameters for filtering, e.g., limit, offset, startDate, endDate
    const { limit = 100, offset = 0, startDate, endDate } = req.query;

    const whereClause = {};
    if (startDate && endDate) {
        whereClause.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        };
    }

    SensorReading.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send({
                status: "success",
                status_code: 200,
                message: "Data retrieved successfully",
                result: data.rows,
                total: data.count,
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
        })
        .catch(err => {
            console.error("Database error:", err);
            res.status(500).send({
                status: "error",
                status_code: 500,
                message: err.message || "Failed to retrieve data"
            });
        });
};

/**
 * Optional: GET /api/sensor-data/latest
 * Retrieves the most recent sensor reading.
 */
exports.GetLatestSensorData = (req, res) => {
    SensorReading.findOne({
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    status: "error",
                    status_code: 404,
                    message: "No sensor data found"
                });
            }
            res.send({
                status: "success",
                status_code: 200,
                message: "Latest data retrieved",
                result: data
            });
        })
        .catch(err => {
            console.error("Database error:", err);
            res.status(500).send({
                status: "error",
                status_code: 500,
                message: err.message || "Failed to retrieve latest data"
            });
        });
};


