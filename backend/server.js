
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const path = require("path");

require("dotenv").config({
    path: __dirname + "/.env"
});

const app = express();

app.use(cors());
app.use(express.json());

// =====================================
// BACKEND STATUS
// =====================================

app.get("/", (req, res) => {
    res.send("Alandi Flood Prediction Backend is Running!");
});

app.get("/api/status", (req, res) => {
    res.json({
        message: "Backend Connected Successfully",
        status: "Running"
    });
});

// =====================================
// COMMUNITY REPORTS API
// =====================================

app.use("/api/reports", require("./routes/reportRoutes"));

// =====================================
// WEATHER API
// =====================================

app.use("/api/weather", require("./routes/weatherRoutes"));

// =====================================
// FLOOD PREDICTION API
// =====================================

app.use("/api/flood", require("./routes/floodRoutes"));

// =====================================
// MACHINE LEARNING PREDICTION API
// =====================================

app.post("/api/predict-risk", (req, res) => {

    const requiredFields = [
        "temperature_2m_c",
        "relative_humidity_2m_percent",
        "precipitation_mm",
        "rain_mm",
        "soil_moisture_0_to_7cm",
        "rainfall_3h",
        "rainfall_6h",
        "rainfall_24h"
    ];

    const inputData = req.body;

    // Validate input data
    for (const field of requiredFields) {

        if (
            inputData[field] === undefined ||
            !Number.isFinite(Number(inputData[field]))
        ) {
            return res.status(400).json({
                success: false,
                error: `Invalid or missing field: ${field}`
            });
        }
    }

   const mlFolder = path.join(__dirname, "..", "alandi-flood-dashboard", "ml");

    // Python virtual environment path
 const pythonPath = "C:\\Users\\vinit\\Downloads\\alandi-flood-dashboard\\ml-env312\\Scripts\\python.exe";

    // Python prediction file
    const pythonScript = path.join(
        mlFolder,
        "predict.py"
    );

    // Run Python model
    const python = spawn(
        pythonPath,
        [pythonScript],
        { cwd: mlFolder }
    );

    let output = "";
    let errorOutput = "";
    let responded = false;

    // Receive Python output
    python.stdout.on("data", (data) => {
        output += data.toString();
    });

    // Receive Python errors
    python.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    // Handle Python execution error
    python.on("error", (error) => {

        responded = true;

        res.status(500).json({
            success: false,
            error: error.message
        });
    });

    // Handle Python completion
    python.on("close", (code) => {

        if (responded) return;

        if (code !== 0) {
            return res.status(500).json({
                success: false,
                error: errorOutput || "Python prediction failed"
            });
        }

        try {

            const result = JSON.parse(output);

            res.json(result);

        } catch (error) {

            res.status(500).json({
                success: false,
                error: "Invalid Python response",
                details: output
            });
        }
    });

    // Send data to Python
    python.stdin.end(JSON.stringify(inputData));

});

// =====================================
// SERVER PORT
// =====================================

const PORT = process.env.PORT || 5000;

// =====================================
// MONGODB CONNECTION
// =====================================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB Connected Successfully");

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        server.on("error", (error) => {
            console.log("SERVER ERROR:", error);
        });

    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });