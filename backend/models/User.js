// Import mongoose to define our schema and model
const mongoose = require("mongoose");

// Define the shape of a User document
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Must be provided
      trim: true,     // Removes extra whitespace from both ends
    },
    email: {
      type: String,
      required: true,
      unique: true,    // No two users can share the same email
      lowercase: true,  // Always store emails in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // Note: this should always be a HASHED password, never plain text.
      // Hashing will be handled later in the authentication logic, not here.
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // Only these two values are allowed
      default: "USER",         // New users are regular users by default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

// Export the model so it can be used elsewhere in the app
module.exports = User;