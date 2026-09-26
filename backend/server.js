// Import required packages
const express = require("express");   // Framework for building the web server
const dotenv = require("dotenv");     // Loads variables from a .env file into process.env
const cors = require("cors");         // Allows the frontend (different origin) to talk to this backend
const connectDB = require("./config/db"); // Function that connects to MongoDB
const authRoutes = require("./routes/authRoutes"); // Routes for register/login/me
const userRoutes = require("./routes/userRoutes"); // Routes for user profile updates
const hotelRoutes = require("./routes/hotelRoutes"); // Routes for hotel CRUD
const roomRoutes = require("./routes/roomRoutes"); // Routes for room CRUD
const amenityRoutes = require("./routes/amenityRoutes"); // Routes for amenity CRUD
const bookingRoutes = require("./routes/bookingRoutes"); // Routes for booking management
const reviewRoutes = require("./routes/reviewRoutes"); // Routes for review management

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

// Auth routes: handles register, login, and me
// This exposes POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
app.use("/api/auth", authRoutes);

// User routes: handles authenticated profile updates
app.use("/api/users", userRoutes);

// Hotel routes: handles hotel CRUD
// This exposes GET/POST /api/hotels and GET/PUT/DELETE /api/hotels/:id
app.use("/api/hotels", hotelRoutes);

// Room routes: handles room CRUD
// This exposes GET/POST /api/rooms and GET/PUT/DELETE /api/rooms/:id
app.use("/api/rooms", roomRoutes);

// Amenity routes: handles amenity CRUD
// This exposes GET/POST /api/amenities and GET/PUT/DELETE /api/amenities/:id
app.use("/api/amenities", amenityRoutes);

// Booking routes: handles creating, viewing, updating, and cancelling bookings
// This exposes POST /api/bookings, GET /api/bookings/my, GET /api/bookings/:id,
// GET /api/bookings/admin/all, PUT /api/bookings/:id/status, PUT /api/bookings/:id/cancel,
// and DELETE /api/bookings/:id
app.use("/api/bookings", bookingRoutes);

// Review routes: handles creating, viewing, updating, and deleting reviews
app.use("/api/reviews", reviewRoutes);

// Use the port from .env, or default to 5000 if not set
const PORT = process.env.PORT || 5000;

// Start the server
// Start the server locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`HotelHub server is running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;