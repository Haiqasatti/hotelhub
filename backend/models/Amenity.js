// Import mongoose to define our schema and model
const mongoose = require("mongoose");

// Define the shape of an Amenity document
const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Must be provided
      unique: true,   // No two amenities can share the same name
      trim: true,     // Removes extra whitespace from both ends
    },
    description: {
      type: String,
      trim: true,
      // Optional: no "required" here since it's not mandatory
    },
    icon: {
      type: String,
      // Optional: could store an icon name or image URL
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Amenity model from the schema
// Note: the model name must stay exactly "Amenity" since Hotel.js uses ref: "Amenity"
const Amenity = mongoose.model("Amenity", amenitySchema);

// Export the model so it can be used elsewhere in the app
module.exports = Amenity;