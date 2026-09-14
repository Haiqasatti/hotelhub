// Import mongoose to talk to MongoDB
const mongoose = require("mongoose");

// Async function that connects to our MongoDB database
const connectDB = async () => {
  try {
    // Try to connect using the connection string stored in .env
    await mongoose.connect(process.env.MONGO_URI);

    // Runs only if the connection succeeds
    console.log("MongoDB connected successfully");
  } catch (error) {
    // Runs if something goes wrong (bad URI, no internet, etc.)
    console.error("MongoDB connection failed:", error.message);

    // Stop the app since the database is required to run properly
    process.exit(1);
  }
};

// Export connectDB so it can be used in server.js
module.exports = connectDB;