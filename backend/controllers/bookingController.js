// Import mongoose so we can validate that an ID is a real MongoDB ObjectId
const mongoose = require("mongoose");

// Import the models we need
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

// Allowed booking statuses (used for validating updateBookingStatus)
const BOOKING_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"];

// @desc   Create a new booking
// @route  POST /api/bookings
// @access Private (logged-in users)
const createBooking = async (req, res) => {
  try {
    const { hotel, room, checkIn, checkOut, guests } = req.body;

    // Make sure the required fields were sent
    if (!hotel || !room || !checkIn || !checkOut || guests === undefined) {
      return res.status(400).json({
        message: "Please provide hotel, room, checkIn, checkOut, and guests",
      });
    }

    // Validate the hotel and room IDs
    if (!mongoose.Types.ObjectId.isValid(hotel)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(room)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    // Make sure the hotel actually exists
    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Make sure the room actually exists
    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Make sure the room actually belongs to the selected hotel
    if (roomDoc.hotel.toString() !== hotel) {
      return res.status(400).json({ message: "This room does not belong to the selected hotel" });
    }

    // Parse and validate the dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: "Please provide valid checkIn and checkOut dates" });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "checkOut date must be after checkIn date" });
    }

    // Calculate number of nights from the dates (never trust a client-sent value)
    const msPerNight = 1000 * 60 * 60 * 24;
    const numberOfNights = Math.round((checkOutDate - checkInDate) / msPerNight);

    // Get the real price from the Room document, not from the client
    const pricePerNight = roomDoc.pricePerNight;
    const totalPrice = numberOfNights * pricePerNight;

    // Check for existing active bookings on this room that overlap the requested dates
    // Overlap rule: existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
    const conflictingBooking = await Booking.findOne({
      room,
      status: { $ne: "Cancelled" }, // Ignore cancelled bookings
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (conflictingBooking) {
      return res.status(409).json({ message: "This room is already booked for the selected dates" });
    }

    // Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      hotel,
      room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      numberOfNights,
      pricePerNight,
      totalPrice,
      // status defaults to "Pending" from the schema
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while creating the booking", error: error.message });
  }
};

// @desc   Get all bookings belonging to the logged-in user
// @route  GET /api/bookings/my
// @access Private (logged-in users)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("hotel")
      .populate("room")
      .populate("user", "-password");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching your bookings", error: error.message });
  }
};

// @desc   Get a single booking by ID
// @route  GET /api/bookings/:id
// @access Private (owner or admin)
const getBookingById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("hotel")
      .populate("room")
      .populate("user", "-password");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the booking's owner or an admin can view it
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You are not allowed to view this booking" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching the booking", error: error.message });
  }
};

// @desc   Get every booking in the system
// @route  GET /api/bookings
// @access Admin (protected in routes)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "-password")
      .populate("hotel")
      .populate("room");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching bookings", error: error.message });
  }
};

// @desc   Update a booking's status
// @route  PUT /api/bookings/:id/status
// @access Admin (protected in routes)
const updateBookingStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const { status } = req.body;

    if (!status || !BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${BOOKING_STATUSES.join(", ")}`,
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while updating the booking status", error: error.message });
  }
};

// @desc   Cancel a booking (sets status to Cancelled, does not delete it)
// @route  PUT /api/bookings/:id/cancel
// @access Private (owner or admin)
const cancelBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the booking's owner or an admin can cancel it
    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You are not allowed to cancel this booking" });
    }

    booking.status = "Cancelled";
    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while cancelling the booking", error: error.message });
  }
};

// @desc   Permanently delete a booking
// @route  DELETE /api/bookings/:id
// @access Admin (protected in routes)
const deleteBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.deleteOne();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while deleting the booking", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
};