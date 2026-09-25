// Import jsonwebtoken to verify tokens
const jwt = require("jsonwebtoken");

// Import the User model so we can look up the logged-in user
const User = require("../models/User");

// Middleware that checks for a valid JWT and attaches the user to req.user
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Make sure the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Extract just the token part (removes "Bearer ")
    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID stored in the token, excluding the password field
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // Attach the user to the request object for use in later routes/controllers
    req.user = user;

    // Move on to the next middleware or route handler
    next();
  } catch (error) {
    // Covers expired tokens, invalid tokens, tampering, etc.
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Export the middleware
module.exports = protect;