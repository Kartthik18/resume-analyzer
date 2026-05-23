// ──────────────────────────────────────────────────────
//  middleware/auth.js  —  JWT Authentication Middleware
//  This protects routes that require a logged-in user
//
//  How it works:
//  1. Client sends requests with header: Authorization: Bearer <token>
//  2. This middleware extracts and verifies that token
//  3. If valid → attach user info to req.user and proceed
//  4. If invalid → respond with 401 Unauthorized
// ──────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the Authorization header value: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // If no header is present, deny access
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  // Extract just the token part (remove "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret key from .env
    // jwt.verify() throws an error if the token is expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data (userId, email) to the request object
    // Downstream route handlers can now access req.user
    req.user = decoded;

    // Move on to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

module.exports = authMiddleware;
