// ──────────────────────────────────────────────────────
//  pages/Login.jsx  —  Login & Signup Page
//
//  This single page handles both login and signup.
//  Toggling between modes is done with a simple boolean state.
//
//  On success → stores JWT token in localStorage → redirects to /dashboard
// ──────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  // Toggle between "login" and "signup" modes
  const [isSignup, setIsSignup] = useState(false);

  // Form field values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Form Submit Handler ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Choose the correct endpoint based on mode
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignup
        ? { name, email, password }
        : { email, password };

      // Send request to backend
      const { data } = await axios.post(endpoint, payload);

      // Save the JWT token and user info to localStorage
      // This keeps the user logged in across page refreshes
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to the protected dashboard
      navigate("/dashboard");
    } catch (err) {
      // Show error message from backend or a fallback
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">

        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text">ResumeAI</h1>
          <p className="text-slate-400 mt-2 text-sm">
            AI-powered resume analysis & interview coaching
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass-card p-8">

          {/* Tab toggle */}
          <div className="flex rounded-xl p-1 mb-6"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <button
              id="login-tab"
              onClick={() => { setIsSignup(false); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isSignup
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              id="signup-tab"
              onClick={() => { setIsSignup(true); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSignup
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name field — only shown on Signup */}
            {isSignup && (
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                minLength={6}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-300"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit button */}
            <button
              id="submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isSignup ? "Creating Account..." : "Logging In..."}
                </>
              ) : (
                isSignup ? "Create Account 🚀" : "Log In →"
              )}
            </button>
          </form>

          {/* Helper text */}
          <p className="text-center text-xs text-slate-500 mt-6">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {isSignup ? "Log In" : "Sign Up Free"}
            </button>
          </p>
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-slate-600 mt-4">
          Upload your resume • Get AI analysis • Ace interviews
        </p>
      </div>
    </div>
  );
}

export default Login;
