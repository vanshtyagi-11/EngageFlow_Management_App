const ClientRequest = require("../models/clientRequestModel");
const Client = require("../models/clientModel");
const ServiceType = require("../models/serviceTypeModel");
const Engagement = require("../models/engagementModel");
const Task = require("../models/taskModel");

const getClient = async (user) =>
  Client.findOne({ accountUser: user._id, isActive: true });

const summary = async (req, res) => {
  const client = await getClient(req.user);
  if (!client)
    return res
      .status(404)
      .json({ success: false, message: "Client profile not found" });
  const engagements = await Engagement.find({ client: client._id })
    .populate("serviceType")
    .sort({ createdAt: -1 });
  const engagementIds = engagements.map((engagement) => engagement._id);
  const tasks = await Task.find({ engagement: { $in: engagementIds } })
    .populate("engagement")
    .sort({ deadline: 1 });
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  res.json({
    success: true,
    client,
    engagements,
    tasks,
    progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  });
};

const createRequest = async (req, res) => {
  const client = await getClient(req.user);
  if (!client)
    return res
      .status(404)
      .json({ success: false, message: "Client profile not found" });
  const { description, serviceType, requestedDeadline } = req.body;
  if (!description || !serviceType || !requestedDeadline)
    return res.status(400).json({
      success: false,
      message: "Service type, completion deadline and description are required",
    });
  if (new Date(requestedDeadline) < new Date())
    return res.status(400).json({
      success: false,
      message: "Completion deadline cannot be in the past",
    });
  const selectedService = await ServiceType.findOne({
    _id: serviceType,
    isActive: true,
  });
  if (!selectedService)
    return res
      .status(404)
      .json({ success: false, message: "Service type not found" });
  const request = await ClientRequest.create({
    client: client._id,
    requestedBy: req.user._id,
    serviceType: selectedService._id,
    title: selectedService.name,
    description,
    requestedDeadline,
  });
  res.status(201).json({ success: true, request });
};

const listRequests = async (req, res) => {
  const client = await getClient(req.user);
  if (!client)
    return res
      .status(404)
      .json({ success: false, message: "Client profile not found" });
  res.json({
    success: true,
    requests: await ClientRequest.find({ client: client._id })
      .sort({
        createdAt: -1,
      })
      .populate("serviceType"),
  });
};

const managerRequests = async (_req, res) => {
  const requests = await ClientRequest.find()
    .populate("client requestedBy engagement serviceType")
    .sort({ createdAt: -1 });

  await Promise.all(
    requests.map(async (request) => {
      if (request.status !== "ACCEPTED" || request.engagement) return;
      const existingEngagement = await Engagement.findOne({
        client: request.client._id,
        createdAt: { $gte: request.createdAt },
      }).sort({ createdAt: 1 });
      if (existingEngagement) {
        request.engagement = existingEngagement._id;
        await request.save();
      }
    })
  );

  res.json({ success: true, requests });
};

const updateRequest = async (req, res) => {
  const request = await ClientRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, managerComment: req.body.managerComment },
    { new: true, runValidators: true }
  );
  if (!request)
    return res
      .status(404)
      .json({ success: false, message: "Request not found" });
  res.json({ success: true, request });
};

module.exports = {
  summary,
  createRequest,
  listRequests,
  managerRequests,
  updateRequest,
};
