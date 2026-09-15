const mongoose = require("mongoose");
const Client = require("../models/clientModel");
const ServiceType = require("../models/serviceTypeModel");
const TaskTemplate = require("../models/taskTemplateModel");
const Engagement = require("../models/engagementModel");
const Task = require("../models/taskModel");
const audit = require("../utils/audit");
const ClientRequest = require("../models/clientRequestModel");

const list = async (req, res) => {
  const filter =
    req.user.role === "CLIENT" ? { client: req.user.clientProfile } : {};
  const engagements = await Engagement.find(filter)
    .populate("client serviceType")
    .sort({ createdAt: -1 });
  res.json({ success: true, engagements });
};
const create = async (req, res) => {
  const { client, serviceType, type, period, startDate, deadline, requestId } =
    req.body;
  if (!client || !serviceType || !type || !period || !startDate || !deadline)
    return res.status(400).json({
      success: false,
      message:
        "client, serviceType, type, period, startDate and deadline are required",
    });
  if (new Date(deadline) < new Date(startDate))
    return res.status(400).json({
      success: false,
      message: "Deadline cannot be before start date",
    });
  const [clientDoc, service] = await Promise.all([
    Client.findById(client),
    ServiceType.findById(serviceType),
  ]);
  if (!clientDoc || !service)
    return res
      .status(404)
      .json({ success: false, message: "Client or service type not found" });
  let clientRequest;
  if (requestId) {
    clientRequest = await ClientRequest.findOne({
      _id: requestId,
      client,
      status: "ACCEPTED",
      engagement: { $exists: false },
    });
    if (!clientRequest)
      return res.status(400).json({
        success: false,
        message:
          "Request must be approved and not already linked to an engagement",
      });
    if (String(clientRequest.serviceType) !== String(serviceType))
      return res.status(400).json({
        success: false,
        message: "The engagement service must match the client request",
      });
  }
  const session = await mongoose.startSession();
  try {
    let engagement;
    await session.withTransaction(async () => {
      [engagement] = await Engagement.create(
        [
          {
            client,
            serviceType,
            type,
            period,
            startDate,
            deadline,
            createdBy: req.user._id,
          },
        ],
        { session }
      );
      const templates = await TaskTemplate.find({ serviceType, isActive: true })
        .sort({ sequence: 1 })
        .session(session);
      if (templates.length)
        await Task.insertMany(
          templates.map((template) => ({
            engagement: engagement._id,
            template: template._id,
            title: template.title,
            description: template.description,
            deadline: new Date(
              Math.min(
                new Date(deadline),
                new Date(
                  new Date(startDate).getTime() +
                    template.defaultDueDays * 86400000
                )
              )
            ),
          })),
          { session }
        );
      if (clientRequest) {
        await ClientRequest.updateOne(
          { _id: clientRequest._id },
          { engagement: engagement._id },
          { session }
        );
      }
    });
    await audit(req.user._id, "ENGAGEMENT", engagement._id, "CREATED", {
      type,
      period,
    });
    res.status(201).json({
      success: true,
      engagement,
      taskCount: await Task.countDocuments({ engagement: engagement._id }),
    });
  } finally {
    await session.endSession();
  }
};

const nextPeriod = async (req, res) => {
  const source = await Engagement.findById(req.params.id).populate(
    "serviceType"
  );
  if (!source)
    return res
      .status(404)
      .json({ success: false, message: "Engagement not found" });
  if (source.type !== "RECURRING")
    return res.status(400).json({
      success: false,
      message: "Only recurring engagements can create a next period",
    });
  const [year, month] = source.period.split("-").map(Number);
  const next = new Date(year, month, 1);
  const period = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  const days = Math.max(
    1,
    Math.round(
      (new Date(source.deadline) - new Date(source.startDate)) / 86400000
    )
  );
  const startDate = new Date(next);
  const deadline = new Date(startDate.getTime() + days * 86400000);
  const session = await mongoose.startSession();
  try {
    let engagement;
    await session.withTransaction(async () => {
      [engagement] = await Engagement.create(
        [
          {
            client: source.client,
            serviceType: source.serviceType._id,
            type: "RECURRING",
            period,
            startDate,
            deadline,
            createdBy: req.user._id,
          },
        ],
        { session }
      );
      const templates = await TaskTemplate.find({
        serviceType: source.serviceType._id,
        isActive: true,
      })
        .sort({ sequence: 1 })
        .session(session);
      if (templates.length)
        await Task.insertMany(
          templates.map((template) => ({
            engagement: engagement._id,
            template: template._id,
            title: template.title,
            description: template.description,
            deadline: new Date(
              Math.min(
                deadline,
                new Date(
                  startDate.getTime() + template.defaultDueDays * 86400000
                )
              )
            ),
          })),
          { session }
        );
    });
    await audit(
      req.user._id,
      "ENGAGEMENT",
      engagement._id,
      "CREATED_NEXT_PERIOD",
      { period, source: source._id }
    );
    res.status(201).json({
      success: true,
      engagement,
      taskCount: await Task.countDocuments({ engagement: engagement._id }),
    });
  } finally {
    await session.endSession();
  }
};

module.exports = { list, create, nextPeriod };
