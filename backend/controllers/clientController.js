const Client = require("../models/clientModel");
const audit = require("../utils/audit");

const list = async (req, res) => {
  const filter =
    req.user.role === "CLIENT"
      ? { _id: req.user.clientProfile, isActive: true }
      : { isActive: true };
  res.json({
    success: true,
    clients: await Client.find(filter).sort({ name: 1 }),
  });
};
const create = async (req, res) => {
  const client = await Client.create({ ...req.body, createdBy: req.user._id });
  await audit(req.user._id, "CLIENT", client._id, "CREATED");
  res.status(201).json({ success: true, client });
};
const update = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!client)
    return res
      .status(404)
      .json({ success: false, message: "Client not found" });
  await audit(req.user._id, "CLIENT", client._id, "UPDATED");
  res.json({ success: true, client });
};
module.exports = { list, create, update };
