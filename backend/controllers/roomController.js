// Import mongoose so we can validate that an ID is a real MongoDB ObjectId
const mongoose = require("mongoose");

// Import the models we need
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

// @desc   Create a new room
// @route  POST /api/rooms
// @access Admin (protected in routes)
const createRoom = async (req, res) => {
  try {
    const { hotel, roomNumber, roomType, pricePerNight, capacity, description, images, amenities } = req.body;

    // Make sure the required fields were sent
    if (!hotel || !roomNumber || !roomType || pricePerNight === undefined || capacity === undefined) {
      return res.status(400).json({
        message: "Please provide hotel, roomNumber, roomType, pricePerNight, and capacity",
      });
    }

    // Make sure the hotel ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(hotel)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    // Make sure the referenced hotel actually exists
    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Create the room in the database
    const room = await Room.create({
      hotel,
      roomNumber,
      roomType,
      pricePerNight,
      capacity,
      description,
      images,
      amenities,
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while creating the room", error: error.message });
  }
};

// @desc   Get all rooms
// @route  GET /api/rooms
// @access Public
const getRooms = async (req, res) => {
  try {
    const { hotel, roomType, minPrice, maxPrice, capacity } = req.query;

    // Build a filter object based on whichever query params were sent
    const filter = {};

    // Filter by hotel ObjectId, validating it first
    if (hotel) {
      if (!mongoose.Types.ObjectId.isValid(hotel)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }
      filter.hotel = hotel;
    }

    // Exact match on room type (e.g. "Suite")
    if (roomType) {
      filter.roomType = roomType;
    }

    // Support minPrice and maxPrice together or separately
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    // Rooms that can hold at least the requested capacity
    if (capacity) {
      filter.capacity = { $gte: Number(capacity) };
    }

    // Fetch rooms matching the filter and populate hotel info and amenities
    const rooms = await Room.find(filter).populate("hotel").populate("amenities");

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching rooms", error: error.message });
  }
};

// @desc   Get a single room by ID
// @route  GET /api/rooms/:id
// @access Public
const getRoomById = async (req, res) => {
  try {
    // Make sure the ID in the URL is actually a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await Room.findById(req.params.id).populate("hotel").populate("amenities");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching the room", error: error.message });
  }
};

// @desc   Update a room
// @route  PUT /api/rooms/:id
// @access Admin (protected in routes)
const updateRoom = async (req, res) => {
  try {
    // Make sure the ID in the URL is actually a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const { hotel, roomNumber, roomType, pricePerNight, capacity, description, images, amenities } = req.body;

    // If a new hotel is being set, validate it before applying it
    if (hotel !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(hotel)) {
        return res.status(400).json({ message: "Invalid hotel ID" });
      }

      const hotelExists = await Hotel.findById(hotel);
      if (!hotelExists) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      room.hotel = hotel;
    }

    // Only update fields that were actually provided
    if (roomNumber !== undefined) room.roomNumber = roomNumber;
    if (roomType !== undefined) room.roomType = roomType;
    if (pricePerNight !== undefined) room.pricePerNight = pricePerNight;
    if (capacity !== undefined) room.capacity = capacity;
    if (description !== undefined) room.description = description;
    if (images !== undefined) room.images = images;
    if (amenities !== undefined) room.amenities = amenities;

    const updatedRoom = await room.save();

    res.status(200).json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while updating the room", error: error.message });
  }
};

// @desc   Delete a room
// @route  DELETE /api/rooms/:id
// @access Admin (protected in routes)
const deleteRoom = async (req, res) => {
  try {
    // Make sure the ID in the URL is actually a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await room.deleteOne();

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while deleting the room", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};