
const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

// Python virtual environment
const pythonExe = path.resolve(
    __dirname,
    "../../ml-env/Scripts/python.exe"
);

// ML model folder
const mlDir = path.resolve(
    __dirname,
    "../../alandi-flood-dashboard/ml"
);

// Required ML input features
const requiredFeatures = [
    "temperature_2m_c",
    "relative_humidity_2m_percent",
    "precipitation_mm",
    "rain_mm",
    "soil_moisture_0_to_7cm",
    "rainfall_3h",
    "rainfall_6h",
    "rainfall_24h"
];

router.post("/predict-risk", (req, res) => {
    const inputData = req.body;

    // Validate input
    for (const feature of requiredFeatures) {
        if (
            inputData[feature] === undefined ||
            !Number.isFinite(Number(inputData[feature]))
        ) {
            return res.status(400).json({
                success: false,
                error: `Invalid or missing feature: ${feature}`
            });
        }
    }

    // Start Python ML prediction
    const python = spawn(
        pythonExe,
        [path.join(mlDir, "predict.py")],
        {
            cwd: mlDir,
            windowsHide: true
        }
    );

    let output = "";
    let errorOutput = "";
    let responded = false;

    python.stdout.on("data", (data) => {
        output += data.toString();
    });

    python.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    python.on("error", (error) => {
        responded = true;

        return res.status(500).json({
            success: false,
            error: "Could not start Python: " + error.message
        });
    });

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

            if (!result.success) {
                return res.status(500).json(result);
            }

            return res.json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: "Invalid response from Python ML model",
                details: output
            });
        }
    });

    // Send input data to Python
    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();
});

module.exports = router;
