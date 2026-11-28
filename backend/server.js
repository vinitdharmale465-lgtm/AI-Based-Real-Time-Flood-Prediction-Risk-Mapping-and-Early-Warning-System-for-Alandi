
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

// ===============================
// CORS CONFIGURATION
// ===============================





const frontendOrigin = (process.env.FRONTEND_URL || "")
  .trim()
  .replace(/\/$/, "");

app.use(
  cors({
    origin: function (origin, callback) {
      
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-based-real-time-flood-prediction-risk-mapping-zf45dcz15.vercel.app",
  "https://ai-based-real-time-flood-prediction-risk-mapping-mkovcklp1.vercel.app",
  frontendOrigin,
].filter(Boolean);


      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===============================
// BASIC ROUTES
// ===============================

app.get("/", (req, res) => {
  res.send("Alandi Flood Prediction Backend is Running!");
});

app.get("/api/status", (req, res) => {
  res.json({
    message: "Backend Connected Successfully",
    status: "Running",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected"
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/flood", require("./routes/floodRoutes"));
app.use("/api", require("./routes/mlRoutes"));

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS blocked this request"
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// ===============================
// MONGODB CONNECTION
// ===============================

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

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
