// ──────────────────────────────────────────────────────
//  components/Navbar.jsx  —  Top Navigation Bar
//
//  Shows the app logo, user name, and a logout button.
//  Logout simply clears localStorage and redirects to /login.
// ──────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Get user info from localStorage (saved during login)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ── Logout ──────────────────────────────────────────
  const handleLogout = () => {
    // Clear all auth data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4"
      style={{
        background: "rgba(10, 10, 26, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo + App Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
            📄
          </div>
          <span className="text-xl font-bold gradient-text">ResumeAI</span>
        </div>

        {/* Right side: user info + logout */}
        <div className="flex items-center gap-4">
          {/* User avatar + name */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
              {/* Show first letter of user's name */}
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="text-sm text-slate-300 font-medium">
              {user.name || "User"}
            </span>
          </div>

          {/* Logout button */}
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
