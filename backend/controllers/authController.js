// Import bcryptjs to hash and compare passwords
const bcrypt = require("bcryptjs");

// Import the User model
const User = require("../models/User");

// Import our helper that creates JWTs
const generateToken = require("../utils/generateToken");

// @desc   Register a new user
// @route  POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Make sure all required fields were sent
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Generate a salt and hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create a JWT for the new user
    const token = generateToken(user._id);

    // Send back user info (never the password) and the token
    res.status(201).json({
      message: "User registered successfully",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while registering", error: error.message });
  }
};

// @desc   Log in an existing user
// @route  POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Make sure both fields were sent
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT for the logged-in user
    const token = generateToken(user._id);

    // Send back user info (never the password) and the token
    res.status(200).json({
      message: "Login successful",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while logging in", error: error.message });
  }
};

// @desc   Get the currently logged-in user's info
// @route  GET /api/auth/me
// Note: req.user is expected to be set by auth middleware (added later)
const getMe = async (req, res) => {
  try {
    // req.user should already be the user document (without password)
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Export all three controller functions
module.exports = {
  registerUser,
  loginUser,
  getMe,
};