// Import mongoose so we can validate that an ID is a real MongoDB ObjectId
const mongoose = require("mongoose");

// Import the models we need
const Review = require("../models/Review");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// @desc   Create a new review
// @route  POST /api/reviews
// @access Private (logged-in users)
const createReview = async (req, res) => {
  try {
    const { hotel, booking, rating, comment } = req.body;

    // Make sure the required fields were sent
    if (!hotel || !booking || rating === undefined || !comment) {
      return res.status(400).json({ message: "Please provide hotel, booking, rating, and comment" });
    }

    // Validate the hotel and booking IDs
    if (!mongoose.Types.ObjectId.isValid(hotel)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(booking)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    // Validate the rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Make sure the hotel actually exists
    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Make sure the booking actually exists
    const bookingDoc = await Booking.findById(booking);
    if (!bookingDoc) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Make sure the booking belongs to the logged-in user
    if (bookingDoc.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only review your own bookings" });
    }

    // Make sure the booking belongs to the selected hotel
    if (bookingDoc.hotel.toString() !== hotel) {
      return res.status(400).json({ message: "This booking does not belong to the selected hotel" });
    }

    // Only completed stays can be reviewed
    if (bookingDoc.status !== "Completed") {
      return res.status(400).json({ message: "You can only review a booking after it is completed" });
    }

    // Prevent the same user from reviewing the same booking twice
    const existingReview = await Review.findOne({ booking });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this booking" });
    }

    // Create the review
    const review = await Review.create({
      user: req.user._id,
      hotel,
      booking,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while creating the review", error: error.message });
  }
};

// @desc   Get all reviews for a specific hotel
// @route  GET /api/reviews/hotel/:id
// @access Public
const getHotelReviews = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    // Fetch reviews for this hotel, newest first, with basic user info attached
    const reviews = await Review.find({ hotel: req.params.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching reviews", error: error.message });
  }
};

// @desc   Get a single review by ID
// @route  GET /api/reviews/:id
// @access Public
const getReviewById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(req.params.id)
      .populate("user", "name email")
      .populate("hotel");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching the review", error: error.message });
  }
};

// @desc   Update a review
// @route  PUT /api/reviews/:id
// @access Private (owner or admin)
const updateReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only the review's owner or an admin can update it
    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You are not allowed to update this review" });
    }

    const { rating, comment } = req.body;

    // Validate rating if it's being changed
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    const updatedReview = await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while updating the review", error: error.message });
  }
};

// @desc   Delete a review
// @route  DELETE /api/reviews/:id
// @access Private (owner or admin)
const deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only the review's owner or an admin can delete it
    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You are not allowed to delete this review" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while deleting the review", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createReview,
  getHotelReviews,
  getReviewById,
  updateReview,
  deleteReview,
};