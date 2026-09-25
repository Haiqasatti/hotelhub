// Import Express to use its Router
const express = require("express");

// Import the controller functions that handle the actual logic
const {
  createAmenity,
  getAmenities,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
} = require("../controllers/amenityController");

// Import middleware to check for a valid JWT and admin role
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Create a router instance
const router = express.Router();

// Public routes - anyone can view amenities
router.get("/", getAmenities);
router.get("/:id", getAmenityById);

// Admin-only routes - must be logged in AND be an admin
router.post("/", protect, adminOnly, createAmenity);
router.put("/:id", protect, adminOnly, updateAmenity);
router.delete("/:id", protect, adminOnly, deleteAmenity);

// Export the router so it can be used in server.js
module.exports = router;