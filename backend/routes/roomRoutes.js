// Import Express to use its Router
const express = require("express");

// Import the controller functions that handle the actual logic
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

// Import middleware to check for a valid JWT and admin role
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Create a router instance
const router = express.Router();

// Public routes - anyone can view rooms
router.get("/", getRooms);
router.get("/:id", getRoomById);

// Admin-only routes - must be logged in AND be an admin
router.post("/", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

// Export the router so it can be used in server.js
module.exports = router;