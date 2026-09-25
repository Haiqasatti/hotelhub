// Import Express to use its Router
const express = require("express");

// Import the controller functions that handle the actual logic
const {
  createReview,
  getHotelReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// Import middleware to check for a valid JWT
const protect = require("../middleware/authMiddleware");

// Create a router instance
const router = express.Router();

// Public routes - "hotel/:id" must come BEFORE "/:id"
// so Express doesn't mistake "hotel" for a review ID
router.get("/hotel/:id", getHotelReviews);
router.get("/:id", getReviewById);

// Protected routes - must be logged in
// (ownership vs admin access is checked inside the controller)
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

// Export the router so it can be used in server.js
module.exports = router;