
const express = require("express");
const router = express.Router();

router.get("/predict", async (req, res) => {
    try {
        const apiKey = process.env.WEATHERAPI_KEY;

        if (!apiKey) {
            return res.status(500).json({
                message: "WEATHERAPI_KEY is missing in backend .env"
            });
        }

        const url =
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=18.67756,73.89868&days=1&aqi=no&alerts=no`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            return res.status(502).json({
                message: data.error?.message || "Weather API failed"
            });
        }

        const current = data.current;
        const day = data.forecast.forecastday[0].day;

        const rainfall = day.totalprecip_mm;
        const rainChance = day.daily_chance_of_rain;

        let risk = "Low";
        let score = 20;
        let reason = "Normal weather conditions";

        if (
            rainfall >= 50 ||
            current.precip_mm >= 20 ||
            rainChance >= 80
        ) {
            risk = "High";
            score = 85;
            reason = "Heavy rainfall or high rain probability";
        } else if (
            rainfall >= 20 ||
            current.precip_mm >= 5 ||
            rainChance >= 50
        ) {
            risk = "Medium";
            score = 55;
            reason = "Moderate rainfall conditions";
        }

        res.json({
            location: "Alandi",
            risk,
            score,
            reason,

            temperature: current.temp_c,
            rainfall: rainfall,
            currentRainfall: current.precip_mm,
            rainChance: rainChance,
            humidity: current.humidity,

            windSpeed: current.wind_kph,
            condition: current.condition.text,

            updatedAt: current.last_updated
        });

    } catch (error) {
        console.error("Flood Prediction Error:", error.message);

        res.status(500).json({
            message: "Unable to calculate flood risk"
        });
    }
});

module.exports = router;
