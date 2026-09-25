// Import mongoose so we can validate that an ID is a real MongoDB ObjectId
const mongoose = require("mongoose");

// Import the Amenity model
const Amenity = require("../models/Amenity");

// @desc   Create a new amenity
// @route  POST /api/amenities
// @access Admin (protected in routes)
const createAmenity = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Make sure the required field was sent
    if (!name) {
      return res.status(400).json({ message: "Please provide a name for the amenity" });
    }

    // Check if an amenity with this name already exists
    const existingAmenity = await Amenity.findOne({ name: name.trim() });
    if (existingAmenity) {
      return res.status(400).json({ message: "An amenity with this name already exists" });
    }

    // Create the amenity in the database
    const amenity = await Amenity.create({ name, description, icon });

    res.status(201).json({
      message: "Amenity created successfully",
      amenity,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while creating the amenity", error: error.message });
  }
};

// @desc   Get all amenities
// @route  GET /api/amenities
// @access Public
const getAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find();

    res.status(200).json(amenities);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching amenities", error: error.message });
  }
};

// @desc   Get a single amenity by ID
// @route  GET /api/amenities/:id
// @access Public
const getAmenityById = async (req, res) => {
  try {
    // Make sure the ID in the URL is actually a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid amenity ID" });
    }

    const amenity = await Amenity.findById(req.params.id);

    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    res.status(200).json(amenity);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching the amenity", error: error.message });
  }
};

// @desc   Update an amenity
// @route  PUT /api/amenities/:id
// @access Admin (protected in routes)
const updateAmenity = async (req, res) => {
  try {
    // Make sure the ID in the URL is actually a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid amenity ID" });
    }

    const amenity = await Amenity.findById(req.params.id);

    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    const { name, description, icon } = req.body;

    // If the name is being changed, make sure it's not already taken by another amenity
    if (name !== undefined) {
      const existingAmenity = await Amenity.findOne({ name: name.trim() });
      if (existingAmenity && existingAmenity._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "An amenity with this name already exists" });
      }
      amenity.name = name;
    }

    // Only update fields that were actually provided
    if (description !== undefined) amenity.description = description;
    if (icon !== undefined) amenity.icon = icon;

    const updatedAmenity = await amenity.save();

    res.status(200).json({
      message: "Amenity updated successfully",
      amenity: updatedAmenity,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while updating the amenity", error: error.message });
  }
};

// @desc   Delete an amenity
// @route  DELETE /api/amenities/:id
// @access Admin (protected in routes)
const deleteAmenity = async (req, res) => {
  try {
    // Make sure the ID in the URL is actually a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid amenity ID" });
    }

    const amenity = await Amenity.findById(req.params.id);

    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    await amenity.deleteOne();

    res.status(200).json({ message: "Amenity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while deleting the amenity", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createAmenity,
  getAmenities,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
};