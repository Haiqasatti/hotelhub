// Import jsonwebtoken to create JWTs
const jwt = require("jsonwebtoken");

// Generates a signed JWT containing the user's ID
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // Payload: what we store inside the token
    process.env.JWT_SECRET,   // Secret key used to sign the token
    { expiresIn: "7d" }       // Token expires in 7 days
  );
};

// Export the function so it can be used elsewhere (e.g. after login/signup)
module.exports = generateToken;