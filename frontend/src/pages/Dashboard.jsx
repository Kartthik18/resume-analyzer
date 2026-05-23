// ──────────────────────────────────────────────────────
//  pages/Dashboard.jsx  —  Main App Dashboard
//
//  This is the core page of the app. It:
//  1. Shows the ResumeUpload component at the top
//  2. Displays the latest AnalysisCard after a new upload
//  3. Fetches and shows the full history of past analyses
//
//  Data Flow:
//  - User uploads resume → ResumeUpload calls onAnalysisComplete()
//  - Dashboard receives the result → stores it in `latestAnalysis` state
//  - On mount → fetches history from GET /api/analyze/history
// ──────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ResumeUpload from "../components/ResumeUpload";
import AnalysisCard from "../components/AnalysisCard";

function Dashboard() {
  // Stores the most recent analysis (from a fresh upload)
  const [latestAnalysis, setLatestAnalysis] = useState(null);

  // Stores the array of all past analyses from MongoDB
  const [history, setHistory] = useState([]);

  // Which history item is currently expanded (by index)
  const [expandedHistory, setExpandedHistory] = useState(null);

  // Loading/error state for history fetch
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  // ── Fetch History on Mount ──────────────────────────
  // useEffect with an empty [] runs once when the component mounts
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/analyze/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(data);
    } catch (err) {
      setHistoryError("Failed to load history. Please refresh the page.");
    } finally {
      setHistoryLoading(false);
    }
  };

  // ── Called by ResumeUpload after successful upload ──
  const handleAnalysisComplete = (data) => {
    // Set the fresh analysis to show at the top
    setLatestAnalysis(data);

    // Prepend the new entry to history list (so newest appears first)
    setHistory((prev) => [
      {
        _id: data.resumeId,
        fileName: data.fileName,
        analysis: data.analysis,
        createdAt: data.createdAt,
      },
      ...prev,
    ]);

    // Scroll down to the results smoothly
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text">Resume Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Upload your resume and get instant AI-powered career insights
          </p>
        </div>

        {/* ── Stats Strip ─────────────────────────────── */}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold gradient-text">{history.length}</p>
              <p className="text-xs text-slate-400 mt-1">Analyses Run</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold gradient-text">
                {history[0]?.analysis?.atsScore ?? "—"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Latest ATS Score</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold gradient-text">
                {history[0]?.analysis?.missingKeywords?.length ?? "—"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Keywords Missing</p>
            </div>
          </div>
        )}

        {/* ── Upload Section ──────────────────────────── */}
        <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />

        {/* ── Latest Analysis Result ──────────────────── */}
        {latestAnalysis && (
          <div id="results-section" className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs text-slate-500 font-medium px-3">LATEST ANALYSIS</span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <AnalysisCard
              analysis={latestAnalysis.analysis}
              fileName={latestAnalysis.fileName}
              createdAt={latestAnalysis.createdAt}
            />
          </div>
        )}

        {/* ── History Section ─────────────────────────── */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-xs text-slate-500 font-medium px-3">ANALYSIS HISTORY</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Loading spinner for history */}
          {historyLoading && (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {/* History fetch error */}
          {historyError && (
            <div className="text-center py-8 text-red-400 text-sm">{historyError}</div>
          )}

          {/* Empty state */}
          {!historyLoading && !historyError && history.length === 0 && (
            <div className="glass-card p-12 text-center animate-fade-in">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-slate-400 font-medium">No analyses yet</p>
              <p className="text-slate-600 text-sm mt-1">Upload your first resume above to get started</p>
            </div>
          )}

          {/* History list — collapsible cards */}
          {!historyLoading && history.map((item, index) => (
            <div key={item._id} className="mb-4 animate-slide-up">
              {/* History item header — click to expand */}
              <button
                id={`history-item-${index}`}
                onClick={() => setExpandedHistory(expandedHistory === index ? null : index)}
                className="glass-card w-full p-4 flex items-center justify-between hover:border-purple-500/30 transition-all duration-200 text-left"
                style={{ border: expandedHistory === index ? "1px solid rgba(124,58,237,0.3)" : undefined }}
              >
                <div className="flex items-center gap-3">
                  {/* ATS Score badge */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{
                      background:
                        item.analysis?.atsScore >= 75 ? "rgba(16,185,129,0.2)" :
                        item.analysis?.atsScore >= 50 ? "rgba(245,158,11,0.2)" :
                        "rgba(239,68,68,0.2)",
                      border: `1px solid ${
                        item.analysis?.atsScore >= 75 ? "rgba(16,185,129,0.3)" :
                        item.analysis?.atsScore >= 50 ? "rgba(245,158,11,0.3)" :
                        "rgba(239,68,68,0.3)"
                      }`,
                      color:
                        item.analysis?.atsScore >= 75 ? "#6ee7b7" :
                        item.analysis?.atsScore >= 50 ? "#fcd34d" :
                        "#fca5a5",
                    }}
                  >
                    {item.analysis?.atsScore ?? "?"}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{item.fileName}</p>
                    <p className="text-slate-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-slate-500 text-sm">
                  {expandedHistory === index ? "▲" : "▼"}
                </span>
              </button>

              {/* Expanded analysis detail */}
              {expandedHistory === index && (
                <div className="mt-2">
                  <AnalysisCard
                    analysis={item.analysis}
                    fileName={item.fileName}
                    createdAt={item.createdAt}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom padding */}
      <div className="h-16" />
    </div>
  );
}

export default Dashboard;
