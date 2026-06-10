// ──────────────────────────────────────────────────────
//  routes/auth.js  —  Signup and Login routes
//
//  POST /api/auth/signup  →  Create a new user account
//  POST /api/auth/login   →  Authenticate and return JWT
// ──────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Create a JWT token ────────────────────────
// The token contains the user's id and email 
// It expires in 7 days — after that the user has to log in again
const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ── POST /api/auth/signup ─────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password before saving (salt rounds = 10)
    // bcrypt.hash() is async and slow by design — makes brute force harder
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user to MongoDB
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate a JWT token for this user
    const token = createToken(user);

    // Return the token and basic user info to the client
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// ── POST /api/auth/login ──────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the plain text password against the stored hash using bcrypt.compare()
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Credentials valid - issue a token
    const token = createToken(user);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;
