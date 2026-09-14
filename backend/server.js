// Import required packages
const express = require("express");   // Framework for building the web server
const dotenv = require("dotenv");     // Loads variables from a .env file into process.env
const cors = require("cors");         // Allows the frontend (different origin) to talk to this backend
const connectDB = require("./config/db"); // Function that connects to MongoDB

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB before starting the server
connectDB();

// Create the Express application
const app = express();

// Enable CORS so requests from the React frontend are allowed
app.use(cors());

// Enable express.json() so we can read JSON data sent in request bodies
app.use(express.json());

// Simple test route to check that the API is working
// Visit: GET http://localhost:5000/api/test
app.get("/api/test", (req, res) => {
  res.json({ message: "HotelHub API is working" });
});

// Use the port from .env, or default to 5000 if not set
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`HotelHub server is running on port ${PORT}`);
});