
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    
    // Fetch user from database to get role and other info
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: "User not found" });
    
    req.user = {
      _id: user._id,
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: "Server error" });
  }
};
