
const mongoose = require("mongoose");

const rainfallSchema = new mongoose.Schema(
    {
        // Record type: hourly or daily
        recordType: {
            type: String,
            enum: ["hourly", "daily"],
            required: true
        },

        // Date and time in UTC
        timestamp: {
            type: Date,
            required: true
        },

        // Indian local date/time
        localTime: {
            type: String
        },

        localDate: {
            type: String
        },

        // Hourly weather data
        temperature: Number,
        humidity: Number,
        precipitation: Number,
        rain: Number,
        soilMoisture: Number,

        // Daily weather data
        precipitationSum: Number,
        rainSum: Number,
        maxTemperature: Number,
        minTemperature: Number,
        meanTemperature: Number
    },
    {
        collection: "rainfall_records",
        versionKey: false
    }
);

// Prevent duplicate records
rainfallSchema.index(
    { recordType: 1, timestamp: 1 },
    { unique: true }
);

module.exports = mongoose.model("Rainfall", rainfallSchema);
