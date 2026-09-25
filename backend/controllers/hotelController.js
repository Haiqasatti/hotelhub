// Import mongoose so we can validate that an ID is a real MongoDB ObjectId
const mongoose = require("mongoose");

// Import the Hotel model
const Hotel = require("../models/Hotel");

// @desc   Create a new hotel
// @route  POST /api/hotels
// @access Admin (protected in routes)
const createHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      images,
      amenities,
      rating,
    } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({
        message: "Please provide name, description, and location",
      });
    }

    const hotel = await Hotel.create({
      name,
      description,
      location,
      images,
      amenities,
      rating: rating !== undefined ? Number(rating) : 0,
    });

    res.status(201).json({
      message: "Hotel created successfully",
      hotel,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while creating the hotel",
      error: error.message,
    });
  }
};

// @desc   Get all hotels
// @route  GET /api/hotels
// @access Public
const getHotels = async (req, res) => {
  try {
    const { location, minRating, maxRating } = req.query;

    // Build a filter object based on whichever query params were sent
    const filter = {};

    // Case-insensitive partial match on location (e.g. "Islamabad" matches "North Islamabad")
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Support minRating and maxRating together or separately
    if (minRating || maxRating) {
      filter.rating = {};
      if (minRating) filter.rating.$gte = Number(minRating);
      if (maxRating) filter.rating.$lte = Number(maxRating);
    }

    // Fetch hotels matching the filter (empty filter returns everything, same as before)
    const hotels = await Hotel.find(filter).populate("amenities");

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching hotels", error: error.message });
  }
};

// @desc   Get a single hotel by ID
// @route  GET /api/hotels/:id
// @access Public
const getHotelById = async (req, res) => {
  try {
    // Make sure the ID in the URL is actually a valid MongoDB ObjectId
    // before we query with it (avoids a crash on bad/malformed IDs)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const hotel = await Hotel.findById(req.params.id).populate("amenities");

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching the hotel", error: error.message });
  }
};

// @desc   Update a hotel
// @route  PUT /api/hotels/:id
// @access Admin (protected in routes)
const updateHotel = async (req, res) => {
  try {
    // Make sure the ID in the URL is actually a valid MongoDB ObjectId
    // before we query with it (avoids a crash on bad/malformed IDs)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const { name, description, location, images, rating, amenities } = req.body;

    // Only update fields that were actually provided
    if (name !== undefined) hotel.name = name;
    if (description !== undefined) hotel.description = description;
    if (location !== undefined) hotel.location = location;
    if (images !== undefined) hotel.images = images;
    if (rating !== undefined) hotel.rating = rating;
    if (amenities !== undefined) hotel.amenities = amenities;

    const updatedHotel = await hotel.save();

    res.status(200).json({
      message: "Hotel updated successfully",
      hotel: updatedHotel,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while updating the hotel", error: error.message });
  }
};

// @desc   Delete a hotel
// @route  DELETE /api/hotels/:id
// @access Admin (protected in routes)
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    await hotel.deleteOne();

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while deleting the hotel", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
};