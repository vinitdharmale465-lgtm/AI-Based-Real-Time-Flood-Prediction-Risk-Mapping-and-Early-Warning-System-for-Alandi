
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
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

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
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/flood", require("./routes/floodRoutes"));
app.use("/api", require("./routes/mlRoutes"));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MongoDB URI is missing in environment variables");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
      console.error("MongoDB Connection Error:", error.message);
    });
}

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
