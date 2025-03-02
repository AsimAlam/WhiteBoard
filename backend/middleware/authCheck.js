const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  console.log("token", token);
  if (!token) return res.status(401).json({ message: "Access Denied. Please login." });

  try {
    req.user = await User.findById(token);
    console.log("user req", req.user);
    if (!req.user) return res.status(401).json({ message: "User not found." });
    next();
  } catch (err) {
    console.log("invalid token");
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
