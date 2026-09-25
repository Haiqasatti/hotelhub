// Import mongoose to define our schema and model
const mongoose = require("mongoose");

// Define the shape of a Room document
const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId, // Reference to another document's _id
      ref: "Hotel",                         // Points to the Hotel model
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true, // Removes extra whitespace from both ends
    },
    roomType: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Suite", "Deluxe"], // Only these values are allowed
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0, // Price can't be negative
    },
    capacity: {
      type: Number,
      required: true,
      min: 1, // A room must hold at least 1 guest
    },
    description: {
      type: String,
      trim: true,
      // Optional: no "required" here since it's not mandatory
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to another document's _id
        ref: "Amenity",                       // Points to the Amenity model
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Room model from the schema
const Room = mongoose.model("Room", roomSchema);

// Export the model so it can be used elsewhere in the app
module.exports = Room;