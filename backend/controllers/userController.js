const User = require("../models/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Client = require("../models/clientModel");

const roleMap = {
  admin: "CLIENT",
  client: "CLIENT",
  manager: "MANAGER",
  employee: "TEAM_MEMBER",
};

const signup = async (req, res) => {
  try {
    const { username, userType, email, password, rePassword } = req.body;

    // Required fields
    if (!username || !userType || !email || !password || !rePassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Password confirmation
    if (password !== rePassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check valid user type
    const role = roleMap[userType];

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    // Check username
    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Check email
    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    if (role === "CLIENT") {
      const client = await Client.create({
        name: username,
        email: email.toLowerCase(),
        createdBy: user._id,
        accountUser: user._id,
      });
      user.clientProfile = client._id;
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (
    !user ||
    !user.isActive ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
  return res.json({ success: true, token, user: user.toJSON() });
};

const me = async (req, res) => res.json({ success: true, user: req.user });

module.exports = {
  signup,
  login,
  me,
};
