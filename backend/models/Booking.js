// Import mongoose to define our schema and model
const mongoose = require("mongoose");

// Define the shape of a Booking document
const bookingSchema = new mongoose.Schema(
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
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room", // Points to the Room model
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1, // Must have at least 1 guest
    },
    numberOfNights: {
      type: Number,
      required: true,
      min: 1, // Booking must be for at least 1 night
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0, // Price can't be negative
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // Total can't be negative
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"], // Only these values are allowed
      default: "Pending", // New bookings start as pending
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Booking model from the schema
const Booking = mongoose.model("Booking", bookingSchema);

// Export the model so it can be used elsewhere in the app
module.exports = Booking;