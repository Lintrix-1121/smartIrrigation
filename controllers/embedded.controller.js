const db = require("../models");
const SensorReading = db.SensorReading;
const { Op } = require("sequelize");
const axios = require("axios");

//CONFIG
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Thresholds
const MOISTURE_THRESHOLD = 30.0;
const N_THRESHOLD = 50.0;
const P_THRESHOLD = 30.0;
const K_THRESHOLD = 100.0;

//HELPERS
const isMoistureLow = (moisture) => moisture < MOISTURE_THRESHOLD;

const isNutrientLow = (nitrogen, phosphorus, potassium) => {
    return (
        nitrogen < N_THRESHOLD ||
        phosphorus < P_THRESHOLD ||
        potassium < K_THRESHOLD
    );
};

//WEATHER FETCH
const fetchWeather = async (lat, lon) => {
    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?lat=${lat}&lon=${lon}` +
            `&appid=${WEATHER_API_KEY}&units=metric`;

        const response = await axios.get(url);

        return {
            weather: response.data.weather?.[0]?.main || null,
            airTemperature: response.data.main?.temp || null,
            humidity: response.data.main?.humidity || null,
            rainfall: response.data.rain?.["1h"] || 0
        };

    } catch (err) {
        console.error("Weather API Error:", err.message);

        return {
            weather: null,
            airTemperature: null,
            humidity: null,
            rainfall: 0
        };
    }
};

//RECEIVE SENSOR DATA
exports.ReceiveSensorData = async (req, res) => {
    try {
        const {
            timestamp,
            latitude,
            longitude,
            moisture,
            temperature,
            conductivity,
            pH,
            nitrogen,
            phosphorus,
            potassium,
            irrigation_on,
            fertilizer_on
        } = req.body;

        // Validation
        if (
            !timestamp ||
            latitude === undefined ||
            longitude === undefined ||
            moisture === undefined ||
            temperature === undefined ||
            conductivity === undefined ||
            pH === undefined ||
            nitrogen === undefined ||
            phosphorus === undefined ||
            potassium === undefined ||
            irrigation_on === undefined ||
            fertilizer_on === undefined
        ) {
            return res.status(400).send({
                status: "error",
                message: "Missing required fields"
            });
        }

        // Fetch Weather Automatically
        const weatherData = await fetchWeather(latitude, longitude);

        // Compute Flags
        const moistureLow = isMoistureLow(moisture);
        const nutrientLow = isNutrientLow(
            nitrogen,
            phosphorus,
            potassium
        );

        // Save Record
        const data = await SensorReading.create({
            timestamp,
            latitude,
            longitude,

            moisture,
            temperature,
            conductivity,
            pH,
            nitrogen,
            phosphorus,
            potassium,

            weather: weatherData.weather,
            airTemperature: weatherData.airTemperature,
            humidity: weatherData.humidity,
            rainfall: weatherData.rainfall,

            irrigationOn: irrigation_on,
            fertilizerOn: fertilizer_on,

            moistureLow,
            nutrientLow
        });

        return res.send({
            status: "success",
            message: "Sensor data saved",
            result: {
                id: data.id,
                weather: weatherData,
                moistureLow,
                nutrientLow
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).send({
            status: "error",
            message: err.message
        });
    }
};

//GET ALL 
exports.GetSensorData = async (req, res) => {
    try {
        const {
            limit = 100,
            offset = 0,
            startDate,
            endDate
        } = req.query;

        const whereClause = {};

        if (startDate && endDate) {
            whereClause.timestamp = {
                [Op.between]: [
                    new Date(startDate),
                    new Date(endDate)
                ]
            };
        }

        const data = await SensorReading.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['timestamp', 'DESC']]
        });

        return res.send({
            status: "success",
            result: data.rows,
            total: data.count
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message
        });
    }
};

//GET LATEST
exports.GetLatestSensorData = async (req, res) => {
    try {
        const data = await SensorReading.findOne({
            order: [['timestamp', 'DESC']]
        });

        if (!data) {
            return res.status(404).send({
                status: "error",
                message: "No sensor data found"
            });
        }

        return res.send({
            status: "success",
            result: data
        });

    } catch (err) {
        return res.status(500).send({
            status: "error",
            message: err.message
        });
    }
};


