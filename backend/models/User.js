// ──────────────────────────────────────────────────────
//  models/User.js  —  Mongoose schema for a User
//  Defines the shape of user documents in MongoDB
// ──────────────────────────────────────────────────────

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // User's display name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Email used for login — must be unique
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password — NEVER store plain text passwords!
    // Hashing is done in the auth route before saving
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the model so routes can import it
module.exports = mongoose.model("User", userSchema);
