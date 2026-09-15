const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user || !user.isActive)
      return res
        .status(401)
        .json({ success: false, message: "User is not active" });
    req.user = user;
    next();
  } catch (error) {
    next(
      Object.assign(new Error("Invalid or expired token"), { statusCode: 401 })
    );
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: "Forbidden" });
    next();
  };

module.exports = { protect, authorize };
