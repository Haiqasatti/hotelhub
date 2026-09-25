// Import mongoose to define our schema and model
const mongoose = require("mongoose");

// Define the shape of a Review document
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to another document's _id
      ref: "User",                          // Points to the User model
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel", // Points to the Hotel model
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Points to the Booking model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Lowest allowed rating
      max: 5, // Highest allowed rating
    },
    comment: {
      type: String,
      required: true,
      trim: true, // Removes extra whitespace from both ends
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Review model from the schema
const Review = mongoose.model("Review", reviewSchema);

// Export the model so it can be used elsewhere in the app
module.exports = Review;