const bcrypt = require("bcrypt");
const User = require("../models/userModal");

const listUsers = async (_req, res) =>
  res.json({
    success: true,
    users: await User.find({ role: { $in: ["MANAGER", "TEAM_MEMBER"] } }).sort({
      createdAt: -1,
    }),
  });
const createUser = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    name,
    designation,
    phone,
    joiningDate,
  } = req.body;
  if (!username || !email || !password || !role)
    return res.status(400).json({
      success: false,
      message: "username, email, password and role are required",
    });
  if (!["MANAGER", "TEAM_MEMBER"].includes(role))
    return res.status(400).json({ success: false, message: "Invalid role" });
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role,
    name,
    designation,
    phone,
    joiningDate,
  });
  res.status(201).json({ success: true, user });
};
const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
};
module.exports = { listUsers, createUser, updateUser };
