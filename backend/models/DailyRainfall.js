
const mongoose = require("mongoose");

const dailyRainfallSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },

        dateIst: {
            type: String
        },

        precipitationSum: Number,
        rainSum: Number,
        maxTemperature: Number,
        minTemperature: Number,
        meanTemperature: Number
    },
    {
        collection: "daily_rainfall",
        versionKey: false
    }
);

dailyRainfallSchema.index(
    { date: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "DailyRainfall",
    dailyRainfallSchema
);
