
const mongoose = require("mongoose");

const historicalWeatherSchema = new mongoose.Schema(
    {
        time: {
            type: String,
            required: true,
            unique: true
        },

        rainfall: {
            type: Number,
            default: null
        },

        precipitation: {
            type: Number,
            default: null
        },

        temperature: {
            type: Number,
            default: null
        },

        humidity: {
            type: Number,
            default: null
        },

        source: {
            type: String,
            default: "Open-Meteo Historical Weather API"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "HistoricalWeather",
    historicalWeatherSchema
);