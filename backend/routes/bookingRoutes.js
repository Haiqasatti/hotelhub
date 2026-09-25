// Import Express to use its Router
const express = require("express");

// Import the controller functions that handle the actual logic
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} = require("../controllers/bookingController");

// Import middleware to check for a valid JWT and admin role
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Create a router instance
const router = express.Router();

// Every booking route requires the user to be logged in
router.use(protect);

// Specific routes ("my" and "admin/all") must come BEFORE "/:id"
// so Express doesn't mistake "my" or "admin" for an ID
router.get("/my", getMyBookings);
router.get("/admin/all", adminOnly, getAllBookings);

// Create a booking - just needs to be logged in
router.post("/", createBooking);

// Get a single booking - controller checks ownership or admin status
router.get("/:id", getBookingById);

// Update booking status - admin only
router.put("/:id/status", adminOnly, updateBookingStatus);

// Cancel a booking - controller checks ownership or admin status
router.put("/:id/cancel", cancelBooking);

// Delete a booking - admin only
router.delete("/:id", adminOnly, deleteBooking);

// Export the router so it can be used in server.js
module.exports = router;