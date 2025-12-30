
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to database
connectDB().catch(err => {
  console.error('Database connection error:', err);
});

const app = express();

// CORS configuration - allow frontend domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (allowedOrigins.length > 0 ? allowedOrigins : '*')
    : '*',
  credentials: true
}));

app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/reservations", require("./routes/reservation.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

module.exports = app;
