// ──────────────────────────────────────────────────────
//  models/Resume.js  —  Mongoose schema for a Resume Analysis
//  Stores the uploaded resume metadata + Gemini's analysis
// ──────────────────────────────────────────────────────

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // Links this analysis to a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Original file name of the uploaded PDF
    fileName: {
      type: String,
      required: true,
    },

    // Raw text extracted from the PDF using pdf-parse
    extractedText: {
      type: String,
      required: true,
    },

    // The full structured analysis returned by Gemini
    analysis: {
      // Score out of 100 — how well the resume matches ATS systems
      atsScore: { type: Number, default: 0 },

      // What the resume does well
      strengths: [String],

      // What needs improvement
      weaknesses: [String],

      // Keywords that ATS systems look for but are missing
      missingKeywords: [String],

      // Skills the candidate lacks for typical job roles
      skillGaps: [String],

      // Better versions of existing bullet points
      improvedBullets: [String],

      // Project ideas to strengthen the resume
      suggestedProjects: [String],

      // Interview questions tailored to this resume
      interviewQuestions: [String],
    },
  },
  {
    // Auto-adds createdAt and updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
