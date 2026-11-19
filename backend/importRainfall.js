
const dns = require("dns");
dns.setServers(["8.8.8.8"]);
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

require("dotenv").config({
    path: __dirname + "/.env"
});

const HourlyRainfall = require("./models/HourlyRainfall");
const DailyRainfall = require("./models/DailyRainfall");

const dataFolder = path.join(__dirname, "data");

function readCSV(fileName) {
    return new Promise((resolve, reject) => {
        const records = [];

        fs.createReadStream(path.join(dataFolder, fileName))
            .pipe(csv())
            .on("data", (row) => records.push(row))
            .on("end", () => resolve(records))
            .on("error", reject);
    });
}

function parseDate(value) {
    if (!value) {
        throw new Error("Date value is missing");
    }

    const date = new Date(value.replace(" ", "T"));

    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid date: " + value);
    }

    return date;
}

function parseNumber(value) {
    if (value === undefined || value === null || value.trim() === "") {
        return undefined;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : undefined;
}

async function importHourlyData() {
    console.log("Reading hourly CSV...");

    const rows = await readCSV(
        "alandi_historical_hourly_clean.csv"
    );

    console.log("Hourly records found:", rows.length);

    const records = rows.map((row) => ({
        timestamp: parseDate(row.time_utc),
        timeIst: row.time_ist,

        temperature: parseNumber(row.temperature_2m_c),
        humidity: parseNumber(row.relative_humidity_2m_percent),
        precipitation: parseNumber(row.precipitation_mm),
        rain: parseNumber(row.rain_mm),
        soilMoisture: parseNumber(row.soil_moisture_0_to_7cm)
    }));

    for (let i = 0; i < records.length; i += 1000) {
        const batch = records.slice(i, i + 1000);

        await HourlyRainfall.bulkWrite(
            batch.map((record) => ({
                updateOne: {
                    filter: { timestamp: record.timestamp },
                    update: { $set: record },
                    upsert: true
                }
            })),
            { ordered: false }
        );

        console.log(
            "Hourly imported:",
            Math.min(i + batch.length, records.length),
            "/",
            records.length
        );
    }
}

async function importDailyData() {
    console.log("Reading daily CSV...");

    const rows = await readCSV(
        "alandi_historical_daily_clean.csv"
    );

    console.log("Daily records found:", rows.length);

    const records = rows.map((row) => ({
        date: parseDate(row.date_utc),
        dateIst: row.date_ist,

        precipitationSum: parseNumber(row.precipitation_sum_mm),
        rainSum: parseNumber(row.rain_sum_mm),
        maxTemperature: parseNumber(row.temperature_2m_max_c),
        minTemperature: parseNumber(row.temperature_2m_min_c),
        meanTemperature: parseNumber(row.temperature_2m_mean_c)
    }));

    for (let i = 0; i < records.length; i += 1000) {
        const batch = records.slice(i, i + 1000);

        await DailyRainfall.bulkWrite(
            batch.map((record) => ({
                updateOne: {
                    filter: { date: record.date },
                    update: { $set: record },
                    upsert: true
                }
            })),
            { ordered: false }
        );

        console.log(
            "Daily imported:",
            Math.min(i + batch.length, records.length),
            "/",
            records.length
        );
    }
}

async function main() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in backend/.env");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");

        // Ensure unique indexes exist before importing
        await HourlyRainfall.init();
        await DailyRainfall.init();

        await importHourlyData();
        await importDailyData();

        console.log("\nHistorical rainfall import completed!");
    } catch (error) {
        console.error("Import failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    }
}

main();
