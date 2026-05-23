// ──────────────────────────────────────────────────────
//  routes/analyze.js  —  Resume Upload, Analysis & History
//
//  POST /api/analyze/upload  →  Upload PDF, extract text,
//                               run Gemini analysis, save to DB
//  GET  /api/analyze/history →  Return all past analyses for user
//
//  Flow for /upload:
//  1. multer saves the PDF file temporarily
//  2. pdf-parse extracts the text content
//  3. geminiService sends text to Gemini AI
//  4. The result is saved to MongoDB
//  5. The analysis is returned to the frontend
// ──────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const authMiddleware = require("../middleware/auth");
const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/geminiService");

// ── Multer Configuration ──────────────────────────────
// multer handles multipart/form-data (file uploads)
// diskStorage saves the file to the /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Make sure the uploads/ directory exists
    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Prefix with timestamp to avoid name collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });

// ── POST /api/analyze/upload ──────────────────────────
// Protected route — user must be logged in
// Accepts a single PDF file with field name "resume"
router.post("/upload", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    // If no file was attached
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file." });
    }

    // Step 1: Read the saved PDF file as a buffer
    const filePath = req.file.path;
    const pdfBuffer = fs.readFileSync(filePath);

    // Step 2: Extract plain text from the PDF
    // pdf-parse reads the binary buffer and returns { text, numpages, ... }
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ message: "Could not extract enough text from the PDF. Make sure it's not a scanned image." });
    }

    // Step 3: Send extracted text to Gemini for analysis
    // This calls our geminiService which returns a structured JSON object
    const analysis = await analyzeResume(extractedText);

    // Step 4: Save everything to MongoDB
    const savedResume = await Resume.create({
      userId: req.user.userId,      // from the JWT token (set by authMiddleware)
      fileName: req.file.originalname,
      extractedText,
      analysis,
    });

    // Step 5: Clean up the temporary PDF file from disk
    fs.unlinkSync(filePath);

    // Return the full analysis + document ID to the frontend
    res.status(201).json({
      message: "Resume analyzed successfully!",
      resumeId: savedResume._id,
      fileName: savedResume.fileName,
      analysis,
      createdAt: savedResume.createdAt,
    });
  } catch (err) {
    console.error("Upload/Analysis error:", err.message);
    res.status(500).json({ message: err.message || "Failed to analyze resume." });
  }
});

// ── GET /api/analyze/history ──────────────────────────
// Returns all past resume analyses for the logged-in user
// Sorted by newest first, and we exclude the large extractedText field
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const analyses = await Resume.find({ userId: req.user.userId })
      .select("-extractedText")   // Don't send the full text back — saves bandwidth
      .sort({ createdAt: -1 });   // Newest first

    res.json(analyses);
  } catch (err) {
    console.error("History fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch history." });
  }
});

module.exports = router;
