// ──────────────────────────────────────────────────────
//  components/AnalysisCard.jsx  —  Displays Gemini Analysis
//
//  Receives the `analysis` object and renders:
//  - ATS Score (animated circular meter)
//  - Strengths, Weaknesses
//  - Missing Keywords, Skill Gaps
//  - Improved Bullet Points
//  - Suggested Projects
//  - Interview Questions
// ──────────────────────────────────────────────────────

import React, { useState } from "react";

// ── ATS Score Circle ────────────────────────────────────
// An SVG-based circular progress indicator
function ScoreCircle({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color changes based on score range
  const color =
    score >= 75 ? "#10b981" :
    score >= 50 ? "#f59e0b" :
    "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          {/* Background track */}
          <circle cx="64" cy="64" r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Animated progress arc */}
          <circle cx="64" cy="64" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease-in-out" }}
          />
        </svg>
        {/* Score number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-semibold mt-2" style={{ color }}>
        {score >= 75 ? "🟢 Great ATS Score" : score >= 50 ? "🟡 Needs Work" : "🔴 Poor ATS Fit"}
      </p>
    </div>
  );
}

// ── Section Component ────────────────────────────────────
// Reusable section with a title, icon, and colored items
function Section({ icon, title, items, badgeClass, numbered = false }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="glass-card p-5 animate-slide-up">
      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            {numbered ? (
              <span className={`badge ${badgeClass} shrink-0 mt-0.5`}>{i + 1}</span>
            ) : (
              <span className="text-purple-400 shrink-0 mt-0.5">›</span>
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Tag Cloud Component ──────────────────────────────────
// Renders items as pill/badge tags (for keywords, skill gaps)
function TagCloud({ icon, title, items, badgeClass }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="glass-card p-5 animate-slide-up">
      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
        <span>{icon}</span> {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className={`badge ${badgeClass}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main AnalysisCard ────────────────────────────────────
function AnalysisCard({ analysis, fileName, createdAt }) {
  const [expanded, setExpanded] = useState(true);

  if (!analysis) return null;

  return (
    <div className="animate-fade-in">
      {/* Header bar */}
      <div className="glass-card p-5 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              📋 Analysis Results
              {fileName && (
                <span className="text-sm font-normal text-slate-400">— {fileName}</span>
              )}
            </h2>
            {createdAt && (
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date(createdAt).toLocaleString()}
              </p>
            )}
          </div>
          {/* Collapse / Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-secondary text-sm px-4 py-2"
          >
            {expanded ? "Collapse ↑" : "Expand ↓"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* ATS Score — prominent top card */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreCircle score={analysis.atsScore || 0} />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">ATS Compatibility Score</h3>
                <p className="text-slate-400 text-sm">
                  This score reflects how well your resume is optimized for Applicant Tracking
                  Systems — the automated tools companies use to filter resumes before a human sees them.
                </p>
                <div className="flex gap-3 mt-4 text-xs text-slate-500">
                  <span>🟢 75–100 Great</span>
                  <span>🟡 50–74 Average</span>
                  <span>🔴 0–49 Needs Work</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2-column grid for Strengths and Weaknesses */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Section icon="✅" title="Strengths" items={analysis.strengths} badgeClass="badge-green" />
            <Section icon="⚠️" title="Weaknesses" items={analysis.weaknesses} badgeClass="badge-red" />
          </div>

          {/* Keywords and Skill Gaps as tag clouds */}
          <div className="grid sm:grid-cols-2 gap-4">
            <TagCloud icon="🔑" title="Missing Keywords" items={analysis.missingKeywords} badgeClass="badge-yellow" />
            <TagCloud icon="📚" title="Skill Gaps" items={analysis.skillGaps} badgeClass="badge-blue" />
          </div>

          {/* Improved Bullet Points */}
          <Section
            icon="✍️"
            title="Improved Bullet Points"
            items={analysis.improvedBullets}
            badgeClass="badge-purple"
            numbered
          />

          {/* Suggested Projects */}
          <Section
            icon="🚀"
            title="Suggested Projects to Add"
            items={analysis.suggestedProjects}
            badgeClass="badge-blue"
            numbered
          />

          {/* Interview Questions */}
          <Section
            icon="🎯"
            title="Likely Interview Questions"
            items={analysis.interviewQuestions}
            badgeClass="badge-purple"
            numbered
          />
        </div>
      )}
    </div>
  );
}

export default AnalysisCard;
