const db = require("../models");
const SensorReading = db.SensorReading;
const { Op } = require("sequelize");
const axios = require("axios");

// CONFIG
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Thresholds (per-plot thresholds are now used on the ESP32,
// but we keep these for backward compatibility / fallback)
const MOISTURE_THRESHOLD = 30.0;
const N_THRESHOLD = 50.0;
const P_THRESHOLD = 30.0;
const K_THRESHOLD = 100.0;

// HELPERS
const isMoistureLow = (moisture) => moisture < MOISTURE_THRESHOLD;
const isNutrientLow = (nitrogen, phosphorus, potassium) => {
  return (
    nitrogen < N_THRESHOLD ||
    phosphorus < P_THRESHOLD ||
    potassium < K_THRESHOLD
  );
};

// WEATHER FETCH (unchanged)
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

// RECEIVE SENSOR DATA (supports multiple plots)
exports.ReceiveSensorData = async (req, res) => {
  try {
    const {
      plots,          // array of plot objects
      timestamp,
      latitude,
      longitude,
      // optional: if single-plot fallback needed, we could also accept individual fields
    } = req.body;

    // Validate presence of required top-level fields
    if (!timestamp || latitude === undefined || longitude === undefined) {
      return res.status(400).send({
        status: "error",
        message: "Missing timestamp, latitude, or longitude"
      });
    }

    // Validate plots array
    if (!plots || !Array.isArray(plots) || plots.length === 0) {
      return res.status(400).send({
        status: "error",
        message: "Missing 'plots' array with sensor readings"
      });
    }

    // Fetch weather once for the farm location
    const weatherData = await fetchWeather(latitude, longitude);

    // Prepare records for bulk insertion
    const records = [];
    for (const p of plots) {
      // Validate each plot object
      if (
        !p.plot ||
        p.moisture === undefined ||
        p.temperature === undefined ||
        p.conductivity === undefined ||
        p.pH === undefined ||
        p.nitrogen === undefined ||
        p.phosphorus === undefined ||
        p.potassium === undefined ||
        p.irrigation_on === undefined ||
        p.fertilizer_on === undefined
      ) {
        // Skip invalid plot or throw error – we'll skip to avoid partial failure
        console.warn(`Skipping invalid plot data:`, p);
        continue;
      }

      // Compute low flags using the global thresholds (or you could use per-plot thresholds if passed)
      const moistureLow = isMoistureLow(p.moisture);
      const nutrientLow = isNutrientLow(p.nitrogen, p.phosphorus, p.potassium);

      records.push({
        plot: p.plot,
        timestamp: new Date(timestamp),
        latitude,
        longitude,
        moisture: p.moisture,
        temperature: p.temperature,
        conductivity: p.conductivity,
        pH: p.pH,
        nitrogen: p.nitrogen,
        phosphorus: p.phosphorus,
        potassium: p.potassium,
        irrigationOn: p.irrigation_on === 1,
        fertilizerOn: p.fertilizer_on === 1,
        weather: weatherData.weather,
        airTemperature: weatherData.airTemperature,
        humidity: weatherData.humidity,
        rainfall: weatherData.rainfall,
        moistureLow,
        nutrientLow
      });
    }

    if (records.length === 0) {
      return res.status(400).send({
        status: "error",
        message: "No valid plot records to save"
      });
    }

    // Bulk create all records
    const saved = await SensorReading.bulkCreate(records);

    return res.send({
      status: "success",
      message: `Sensor data saved for ${saved.length} plot(s)`,
      result: {
        count: saved.length,
        weather: weatherData,
        // Optionally return the first few records
        // saved: saved.slice(0, 5)
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

// GET ALL (with optional plot filter)
exports.GetSensorData = async (req, res) => {
  try {
    const {
      limit = 100,
      offset = 0,
      startDate,
      endDate,
      plot    // new: filter by plot (A, B, or C)
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

    if (plot) {
      whereClause.plot = plot;
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

// GET LATEST (with optional plot filter)
exports.GetLatestSensorData = async (req, res) => {
  try {
    const { plot } = req.query;

    const whereClause = {};
    if (plot) {
      whereClause.plot = plot;
    }

    const data = await SensorReading.findOne({
      where: whereClause,
      order: [['timestamp', 'DESC']]
    });

    if (!data) {
      return res.status(404).send({
        status: "error",
        message: "No sensor data found" + (plot ? ` for plot ${plot}` : "")
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













// const db = require("../models");
// const SensorReading = db.SensorReading;
// const { Op } = require("sequelize");
// const axios = require("axios");

// //CONFIG
// const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// // Thresholds
// const MOISTURE_THRESHOLD = 30.0;
// const N_THRESHOLD = 50.0;
// const P_THRESHOLD = 30.0;
// const K_THRESHOLD = 100.0;

// //HELPERS
// const isMoistureLow = (moisture) => moisture < MOISTURE_THRESHOLD;

// const isNutrientLow = (nitrogen, phosphorus, potassium) => {
//     return (
//         nitrogen < N_THRESHOLD ||
//         phosphorus < P_THRESHOLD ||
//         potassium < K_THRESHOLD
//     );
// };

// //WEATHER FETCH
// const fetchWeather = async (lat, lon) => {
//     try {
//         const url =
//             `https://api.openweathermap.org/data/2.5/weather` +
//             `?lat=${lat}&lon=${lon}` +
//             `&appid=${WEATHER_API_KEY}&units=metric`;

//         const response = await axios.get(url);

//         return {
//             weather: response.data.weather?.[0]?.main || null,
//             airTemperature: response.data.main?.temp || null,
//             humidity: response.data.main?.humidity || null,
//             rainfall: response.data.rain?.["1h"] || 0
//         };

//     } catch (err) {
//         console.error("Weather API Error:", err.message);

//         return {
//             weather: null,
//             airTemperature: null,
//             humidity: null,
//             rainfall: 0
//         };
//     }
// };

// //RECEIVE SENSOR DATA
// exports.ReceiveSensorData = async (req, res) => {
//     try {
//         const {
//             timestamp,
//             latitude,
//             longitude,
//             moisture,
//             temperature,
//             conductivity,
//             pH,
//             nitrogen,
//             phosphorus,
//             potassium,
//             irrigation_on,
//             fertilizer_on
//         } = req.body;

//         // Validation
//         if (
//             !timestamp ||
//             latitude === undefined ||
//             longitude === undefined ||
//             moisture === undefined ||
//             temperature === undefined ||
//             conductivity === undefined ||
//             pH === undefined ||
//             nitrogen === undefined ||
//             phosphorus === undefined ||
//             potassium === undefined ||
//             irrigation_on === undefined ||
//             fertilizer_on === undefined
//         ) {
//             return res.status(400).send({
//                 status: "error",
//                 message: "Missing required fields"
//             });
//         }

//         // Fetch Weather Automatically
//         const weatherData = await fetchWeather(latitude, longitude);

//         // Compute Flags
//         const moistureLow = isMoistureLow(moisture);
//         const nutrientLow = isNutrientLow(
//             nitrogen,
//             phosphorus,
//             potassium
//         );

//         // Save Record
//         const data = await SensorReading.create({
//             timestamp,
//             latitude,
//             longitude,

//             moisture,
//             temperature,
//             conductivity,
//             pH,
//             nitrogen,
//             phosphorus,
//             potassium,

//             weather: weatherData.weather,
//             airTemperature: weatherData.airTemperature,
//             humidity: weatherData.humidity,
//             rainfall: weatherData.rainfall,

//             irrigationOn: irrigation_on,
//             fertilizerOn: fertilizer_on,

//             moistureLow,
//             nutrientLow
//         });

//         return res.send({
//             status: "success",
//             message: "Sensor data saved",
//             result: {
//                 id: data.id,
//                 weather: weatherData,
//                 moistureLow,
//                 nutrientLow
//             }
//         });

//     } catch (err) {
//         console.error(err);

//         return res.status(500).send({
//             status: "error",
//             message: err.message
//         });
//     }
// };

// //GET ALL 
// exports.GetSensorData = async (req, res) => {
//     try {
//         const {
//             limit = 100,
//             offset = 0,
//             startDate,
//             endDate
//         } = req.query;

//         const whereClause = {};

//         if (startDate && endDate) {
//             whereClause.timestamp = {
//                 [Op.between]: [
//                     new Date(startDate),
//                     new Date(endDate)
//                 ]
//             };
//         }

//         const data = await SensorReading.findAndCountAll({
//             where: whereClause,
//             limit: parseInt(limit),
//             offset: parseInt(offset),
//             order: [['timestamp', 'DESC']]
//         });

//         return res.send({
//             status: "success",
//             result: data.rows,
//             total: data.count
//         });

//     } catch (err) {
//         return res.status(500).send({
//             status: "error",
//             message: err.message
//         });
//     }
// };

// //GET LATEST
// exports.GetLatestSensorData = async (req, res) => {
//     try {
//         const data = await SensorReading.findOne({
//             order: [['timestamp', 'DESC']]
//         });

//         if (!data) {
//             return res.status(404).send({
//                 status: "error",
//                 message: "No sensor data found"
//             });
//         }

//         return res.send({
//             status: "success",
//             result: data
//         });

//     } catch (err) {
//         return res.status(500).send({
//             status: "error",
//             message: err.message
//         });
//     }
// };


