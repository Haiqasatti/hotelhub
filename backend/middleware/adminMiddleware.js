// Middleware that only allows access to admin users
// Assumes authMiddleware (protect) has already run and set req.user
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    // User is an admin, continue to the next handler
    next();
  } else {
    // User is missing or not an admin
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

// Export the middleware
module.exports = adminOnly;