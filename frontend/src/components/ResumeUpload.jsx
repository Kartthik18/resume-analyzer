// ──────────────────────────────────────────────────────
//  components/ResumeUpload.jsx  —  PDF Upload Area
//
//  Features:
//  - Drag-and-drop support
//  - Click-to-browse file picker
//  - File validation (PDF only, max 5MB)
//  - Upload progress / loading state
//  - Sends file to backend POST /api/analyze/upload
//  - Calls onAnalysisComplete() with the result
// ──────────────────────────────────────────────────────

import React, { useState, useRef } from "react";
import axios from "axios";

function ResumeUpload({ onAnalysisComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  // Ref to the hidden file input element
  const fileInputRef = useRef(null);

  // ── File Validation ─────────────────────────────────
  const validateFile = (file) => {
    if (!file) return "No file selected.";
    if (file.type !== "application/pdf") return "Only PDF files are accepted.";
    if (file.size > 5 * 1024 * 1024) return "File size must be under 5MB.";
    return null; // null = no error
  };

  // ── Handle File Selection (click or drop) ───────────
  const handleFile = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  // ── Drag & Drop Event Handlers ──────────────────────
  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow dropping
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // ── Input Change (file browser) ─────────────────────
  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  // ── Upload + Analyze ────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    setProgress(0);

    try {
      // Get the JWT token from localStorage to send in headers
      const token = localStorage.getItem("token");

      // Build a FormData object — required for file uploads (multipart/form-data)
      const formData = new FormData();
      formData.append("resume", selectedFile); // "resume" matches multer's field name

      // POST the file to the backend
      // onUploadProgress gives us real-time upload progress
      const { data } = await axios.post("/api/analyze/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      // Pass the analysis result up to Dashboard.jsx
      onAnalysisComplete(data);

      // Reset the form
      setSelectedFile(null);
      setProgress(0);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="glass-card p-8 animate-slide-up">
      <h2 className="text-xl font-bold text-white mb-2">Analyze Your Resume</h2>
      <p className="text-slate-400 text-sm mb-6">
        Upload a PDF resume and get instant AI-powered feedback
      </p>

      {/* Drag & Drop Zone */}
      <div
        id="drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "scale-102 border-purple-500"
            : selectedFile
            ? "border-green-500"
            : "border-slate-700 hover:border-purple-500/50"
        }`}
        style={{
          border: `2px dashed ${
            isDragging ? "#7c3aed" : selectedFile ? "#10b981" : "#334155"
          }`,
          background: isDragging
            ? "rgba(124, 58, 237, 0.06)"
            : "rgba(255,255,255,0.02)",
        }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Upload icon */}
        <div className="text-5xl mb-4">
          {selectedFile ? "✅" : isDragging ? "📂" : "📎"}
        </div>

        {selectedFile ? (
          <div>
            <p className="text-green-400 font-semibold text-lg">{selectedFile.name}</p>
            <p className="text-slate-500 text-sm mt-1">
              {(selectedFile.size / 1024).toFixed(1)} KB — Ready to analyze
            </p>
          </div>
        ) : (
          <div>
            <p className="text-slate-300 font-medium">
              {isDragging ? "Drop your PDF here!" : "Drag & drop your resume here"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              or <span className="text-purple-400 underline">click to browse</span>
            </p>
            <p className="text-slate-600 text-xs mt-3">PDF only • Max 5MB</p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 px-4 py-3 rounded-xl text-sm text-red-300"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Upload progress bar */}
      {loading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>
              {progress < 100 ? "Uploading..." : "Analyzing with Gemini AI..."}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
              }}
            />
          </div>
          {progress >= 100 && (
            <p className="text-xs text-purple-400 mt-2 flex items-center gap-2">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Gemini is reading your resume... this may take 10–20 seconds
            </p>
          )}
        </div>
      )}

      {/* Analyze Button */}
      <button
        id="analyze-btn"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          "✨ Analyze with AI"
        )}
      </button>
    </div>
  );
}

export default ResumeUpload;
