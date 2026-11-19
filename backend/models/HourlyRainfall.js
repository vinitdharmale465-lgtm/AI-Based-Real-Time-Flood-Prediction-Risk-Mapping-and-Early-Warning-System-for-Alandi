
const mongoose = require("mongoose");

const hourlyRainfallSchema = new mongoose.Schema(
    {
        timestamp: {
            type: Date,
            required: true
        },

        timeIst: {
            type: String
        },

        temperature: Number,
        humidity: Number,
        precipitation: Number,
        rain: Number,
        soilMoisture: Number
    },
    {
        collection: "hourly_rainfall",
        versionKey: false
    }
);

hourlyRainfallSchema.index(
    { timestamp: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "HourlyRainfall",
    hourlyRainfallSchema
);
