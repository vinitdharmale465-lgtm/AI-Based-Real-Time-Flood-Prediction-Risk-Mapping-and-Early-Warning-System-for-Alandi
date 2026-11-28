
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config({
    path: __dirname + "/.env"
});

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Home route
app.get("/", (req, res) => {
    res.send("Alandi Flood Prediction Backend is Running!");
});

// Backend status
app.get("/api/status", (req, res) => {
    res.json({
        message: "Backend Connected Successfully",
        status: "Running"
    });
});

// Existing routes
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));

// Authentication route
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/flood", require("./routes/floodRoutes"));
app.use("/api", require("./routes/mlRoutes"));

//

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });
    const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
