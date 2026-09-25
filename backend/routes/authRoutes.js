// Import Express to use its Router
const express = require("express");

// Import the controller functions that handle the actual logic
const { registerUser, loginUser, getMe } = require("../controllers/authController");

// Import the middleware that checks for a valid JWT
const protect = require("../middleware/authMiddleware");

// Create a router instance
const router = express.Router();

// POST /api/auth/register -> create a new user
router.post("/register", registerUser);

// POST /api/auth/login -> log in an existing user
router.post("/login", loginUser);

// GET /api/auth/me -> get the logged-in user's info (protected route)
router.get("/me", protect, getMe);

// Export the router so it can be used in server.js
module.exports = router;