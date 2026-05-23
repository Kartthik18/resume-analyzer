// ──────────────────────────────────────────────────────
//  App.jsx  —  Root component with routing setup
//
//  Routes:
//  /         → Redirects to /login or /dashboard
//  /login    → Login + Signup page (public)
//  /dashboard → Main app page (protected — requires login)
//
//  Auth check:
//  We store the JWT token in localStorage.
//  If no token exists, redirect the user to /login.
// ──────────────────────────────────────────────────────

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// ── ProtectedRoute component ──────────────────────────
// Wraps routes that require authentication.
// If no token in localStorage → redirect to /login
// If token exists → render the child component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// ── App component ─────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route — login/signup */}
        <Route path="/login" element={<Login />} />

        {/* Protected route — only accessible when logged in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect — go to dashboard, ProtectedRoute handles auth */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
