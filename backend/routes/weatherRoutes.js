
const express = require("express");

const HistoricalWeather = require("../models/HistoricalWeather");
const HourlyRainfall = require("../models/HourlyRainfall");
const DailyRainfall = require("../models/DailyRainfall");

const router = express.Router();

// =====================================
// ALANDI COORDINATES
// =====================================

const LAT = 18.67756;
const LON = 73.89868;

// =====================================
// WEATHER API CONFIGURATION
// =====================================

const API_KEY = process.env.WEATHERAPI_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

// =====================================
// COMMON WEATHER API FUNCTION
// =====================================

async function getWeather(endpoint, params = {}) {
    if (!API_KEY) {
        throw new Error("WEATHERAPI_KEY is missing in backend .env");
    }

    const url = new URL(`${BASE_URL}/${endpoint}`);

    url.searchParams.set("key", API_KEY);
    url.searchParams.set("q", `${LAT},${LON}`);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message || "WeatherAPI request failed"
        );
    }

    return data;
}


// =====================================
// 1. CURRENT WEATHER API
// =====================================

router.get("/current", async (req, res) => {
    try {
        const data = await getWeather("current.json");

        const current = data.current;

        res.json({
            location: data.location.name,
            country: data.location.country,

            temperature: current.temp_c,
            feelsLike: current.feelslike_c,
            humidity: current.humidity,

            rainfall: current.precip_mm,

            // Convert km/h to m/s
            windSpeed: current.wind_kph / 3.6,

            windDirection: current.wind_degree,

            condition: current.condition.text,
            mainCondition: current.condition.text,

            pressure: current.pressure_mb,

            // Convert km to meters
            visibility: current.vis_km * 1000,

            clouds: current.cloud,

            lastUpdated: current.last_updated_epoch
        });

    } catch (error) {
        console.error("Current Weather Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// 2. RAINFALL FORECAST API
// Next 24 hours - 3 hour intervals
// =====================================

router.get("/forecast", async (req, res) => {
    try {
        const data = await getWeather("forecast.json", {
            days: 2,
            aqi: "no",
            alerts: "no"
        });

        const currentTime = Math.floor(Date.now() / 1000);

        const allHours = data.forecast.forecastday
            .flatMap(day => day.hour)
            .filter(hour => hour.time_epoch >= currentTime)
            .slice(0, 24);

        const forecast = [];

        for (let i = 0; i < allHours.length; i += 3) {

            const group = allHours.slice(i, i + 3);

            if (group.length === 0) {
                continue;
            }

            // Total rainfall during 3 hours
            const rainfallValues = group
                .map(hour => hour.precip_mm)
                .filter(value => value != null);

            const rainfall = rainfallValues.length > 0
                ? Number(
                    rainfallValues.reduce(
                        (total, value) => total + value, 0
                    ).toFixed(2)
                )
                : null;

            // Average temperature
            const temperatures = group
                .map(hour => hour.temp_c)
                .filter(value => value != null);

            const avgTemperature = temperatures.length > 0
                ? Number(
                    (
                        temperatures.reduce(
                            (total, value) => total + value, 0
                        ) / temperatures.length
                    ).toFixed(1)
                )
                : null;

            // Highest rain probability
            const probabilities = group
                .map(hour => hour.chance_of_rain)
                .filter(value => value != null);

            const rainProbability = probabilities.length > 0
                ? Math.max(...probabilities)
                : null;

            forecast.push({
                time: group[0].time,
                temperature: avgTemperature,
                rainfall,
                rainProbability,
                condition: group[0].condition.text
            });
        }

        res.json({
            location: data.location.name,
            country: data.location.country,
            forecast
        });

    } catch (error) {
        console.error("Forecast Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// 3. HISTORICAL RAINFALL API
// Open-Meteo Archive API
// =====================================

router.get("/historical", async (req, res) => {
    try {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 5);

        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 29);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;
        };

        const start = formatDate(startDate);
        const end = formatDate(endDate);

        const url = new URL(
            "https://archive-api.open-meteo.com/v1/archive"
        );

        url.searchParams.set("latitude", LAT);
        url.searchParams.set("longitude", LON);
        url.searchParams.set("start_date", start);
        url.searchParams.set("end_date", end);

        url.searchParams.set(
            "hourly",
            "precipitation,rain,temperature_2m,relative_humidity_2m"
        );

        url.searchParams.set("timezone", "Asia/Kolkata");

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.reason || "Historical weather request failed"
            );
        }

        if (!data.hourly || !data.hourly.time) {
            throw new Error("Historical weather data is unavailable");
        }

        const historical = data.hourly.time.map((time, index) => ({
            time: time,
            rainfall: data.hourly.rain[index],
            precipitation: data.hourly.precipitation[index],
            temperature: data.hourly.temperature_2m[index],
            humidity: data.hourly.relative_humidity_2m[index]
        }));

        res.json({
            location: "Alandi",
            source: "Open-Meteo Historical Weather API",

            dataType:
                "Historical reanalysis estimates, not local rain-gauge measurements",

            rainfallUnit: "mm",
            temperatureUnit: "Celsius",

            startDate: start,
            endDate: end,

            records: historical.length,
            historical
        });

    } catch (error) {
        console.error("Historical Weather Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// 4. SAVE HISTORICAL WEATHER TO MONGODB
// =====================================

router.post("/historical/save", async (req, res) => {
    try {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 5);

        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 29);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;
        };

        const url = new URL(
            "https://archive-api.open-meteo.com/v1/archive"
        );

        url.searchParams.set("latitude", LAT);
        url.searchParams.set("longitude", LON);
        url.searchParams.set("start_date", formatDate(startDate));
        url.searchParams.set("end_date", formatDate(endDate));

        url.searchParams.set(
            "hourly",
            "precipitation,rain,temperature_2m,relative_humidity_2m"
        );

        url.searchParams.set("timezone", "Asia/Kolkata");

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.reason || "Historical API request failed"
            );
        }

        const times = data.hourly.time;

        const operations = times.map((time, index) => ({
            updateOne: {
                filter: { time },
                update: {
                    $set: {
                        rainfall: data.hourly.rain[index],
                        precipitation: data.hourly.precipitation[index],
                        temperature: data.hourly.temperature_2m[index],
                        humidity: data.hourly.relative_humidity_2m[index],
                        source: "Open-Meteo Historical Weather API"
                    }
                },
                upsert: true
            }
        }));

        const result = await HistoricalWeather.bulkWrite(operations);

        res.json({
            message: "Historical weather data saved successfully",
            totalRecords: times.length,
            insertedRecords: result.upsertedCount,
            updatedRecords: result.modifiedCount
        });

    } catch (error) {
        console.error("MongoDB Historical Save Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// 5. GET HISTORICAL DATA FROM MONGODB
// =====================================

router.get("/historical/db", async (req, res) => {
    try {
        const records = await HistoricalWeather.find()
            .sort({ time: 1 });

        res.json({
            location: "Alandi",
            totalRecords: records.length,
            historical: records
        });

    } catch (error) {
        console.error("MongoDB Historical Fetch Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// 6. GET HOURLY RAINFALL FROM MONGODB
// =====================================

router.get("/history/hourly", async (req, res) => {
    try {
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 500, 1),
            5000
        );

        const records = await HourlyRainfall.find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();

        res.json({
            location: "Alandi",
            source: "MongoDB Historical Rainfall Dataset",
            totalRecords: records.length,
            hourly: records
        });

    } catch (error) {
        console.error("Hourly Rainfall Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// 7. GET DAILY RAINFALL FROM MONGODB
// =====================================

router.get("/history/daily", async (req, res) => {
    try {
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 500, 1),
            5000
        );

        const records = await DailyRainfall.find()
            .sort({ date: -1 })
            .limit(limit)
            .lean();

        res.json({
            location: "Alandi",
            source: "MongoDB Historical Rainfall Dataset",
            totalRecords: records.length,
            daily: records
        });

    } catch (error) {
        console.error("Daily Rainfall Error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});


// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;
module.exports = router;

// =====================================
// 3. HISTORICAL WEATHER API
// Alandi - 2024 to 2025
// =====================================

router.get("/history", async (req, res) => {
    try {
        const url =
            "https://archive-api.open-meteo.com/v1/archive" +
            "?latitude=18.67756" +
            "&longitude=73.89868" +
            "&start_date=2024-01-01" +
            "&end_date=2025-12-31" +
            "&daily=precipitation_sum,rain_sum,temperature_2m_mean,relative_humidity_2m_mean" +
            "&timezone=Asia%2FKolkata";

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data.reason || "Historical weather API failed"
            });
        }

        const history = data.daily.time.map((date, index) => ({
            date: date,
            rainfall: data.daily.rain_sum[index],
            precipitation: data.daily.precipitation_sum[index],
            temperature: data.daily.temperature_2m_mean[index],
            humidity: data.daily.relative_humidity_2m_mean[index]
        }));

        res.json({
            location: "Alandi",
            source: "Open-Meteo Historical Weather API",
            dataType: "Historical weather reanalysis",
            totalRecords: history.length,
            history: history
        });

    } catch (error) {
        console.log("Historical Weather Error:", error.message);

        res.status(500).json({
            message: "Unable to fetch historical weather data"
        });
    }
});
