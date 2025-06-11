const jwt = require("jsonwebtoken");
const User = require("../models/User");

const roleCheck = (allowedRoles) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log('roleCheck: Received token:', token);
    if (!token) {
      console.log('roleCheck: No token provided');
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('roleCheck: Decoded token:', decoded);
      const user = await User.findById(decoded.id);
      if (!user) {
        console.log('roleCheck: User not found for id:', decoded.id);
        return res.status(401).json({ message: "Invalid user" });
      }
      if (!allowedRoles.includes(user.role)) {
        console.log('roleCheck: User role not allowed:', user.role);
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user;
      next();
    } catch (err) {
      console.log('roleCheck: Token verification failed:', err.message);
      res.status(401).json({ message: "Invalid Token" });
    }
  };
};

module.exports = roleCheck;
