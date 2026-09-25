// Import mongoose to define our schema and model
const mongoose = require("mongoose");

// Define the shape of a Hotel document
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Must be provided
      trim: true,     // Removes extra whitespace from both ends
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    rating: {
      type: Number,
      default: 0, // New hotels start with no rating
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

// Create the Hotel model from the schema
const Hotel = mongoose.model("Hotel", hotelSchema);

// Export the model so it can be used elsewhere in the app
module.exports = Hotel;