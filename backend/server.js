// ──────────────────────────────────────────────────────
//  server.js  —  Main entry point for the Express backend
//  This file wires together: Express, MongoDB, and routes
// ──────────────────────────────────────────────────────

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────
// Allow requests from the React frontend (localhost:5173)
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded files statically (optional, for debugging)
app.use("/uploads", express.static("uploads"));

// ── Routes ────────────────────────────────────────────
// Auth routes: /api/auth/signup  and  /api/auth/login
app.use("/api/auth", require("./routes/auth"));

// Analyze routes: /api/analyze/upload  and  /api/analyze/history
app.use("/api/analyze", require("./routes/analyze"));

// ── Health Check ──────────────────────────────────────
// Simple route to verify the server is running
app.get("/", (req, res) => {
  res.json({ message: "AI Resume Analyzer API is running ✅" });
});

// ── MongoDB Connection ────────────────────────────────
// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    // Only start listening after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit the process if DB fails
  });
