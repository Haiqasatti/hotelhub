// Import Express to use its Router
const express = require("express");

// Import the controller functions that handle the actual logic
const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");

// Import middleware to check for a valid JWT and admin role
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Create a router instance
const router = express.Router();

// Public routes - anyone can view hotels
router.get("/", getHotels);
router.get("/:id", getHotelById);

// Admin-only routes - must be logged in AND be an admin
router.post("/", protect, adminOnly, createHotel);
router.put("/:id", protect, adminOnly, updateHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);

// Export the router so it can be used in server.js
module.exports = router;