const ServiceType = require("../models/serviceTypeModel");
const TaskTemplate = require("../models/taskTemplateModel");
const Engagement = require("../models/engagementModel");
const Task = require("../models/taskModel");

const defaultServices = [
  {
    name: "Monthly GST Compliance",
    description: "Monthly GST compliance and filing work.",
    recurrence: "MONTHLY",
  },
  {
    name: "GST Registration",
    description: "GST registration and related onboarding work.",
    recurrence: "ONE_TIME",
  },
  {
    name: "GST Refund",
    description: "GST refund preparation and filing work.",
    recurrence: "ONE_TIME",
  },
];

const ensureDefaultServices = async (userId) => {
  await ServiceType.bulkWrite(
    defaultServices.map((service) => ({
      updateOne: {
        filter: { name: service.name },
        update: {
          $set: {
            description: service.description,
            recurrence: service.recurrence,
            isDefault: true,
          },
          $setOnInsert: {
            name: service.name,
            createdBy: userId,
            isActive: true,
          },
        },
        upsert: true,
      },
    }))
  );
  const services = await ServiceType.find({
    name: { $in: defaultServices.map((service) => service.name) },
  });
  await Promise.all(
    services.map(async (service) => {
      const hasTemplate = await TaskTemplate.exists({
        serviceType: service._id,
        isActive: true,
      });
      if (!hasTemplate)
        await TaskTemplate.create({
          serviceType: service._id,
          title: `${service.name} work`,
          defaultDueDays: 7,
          sequence: 0,
        });
    })
  );
  const serviceTypes = await ServiceType.find({ isActive: true });
  const serviceIds = serviceTypes.map((service) => service._id);
  const templates = await TaskTemplate.find({
    serviceType: { $in: serviceIds },
    isActive: true,
  });
  const engagements = await Engagement.find({
    serviceType: { $in: serviceIds },
  });
  await Promise.all(
    engagements.flatMap((engagement) =>
      templates
        .filter(
          (template) =>
            String(template.serviceType) === String(engagement.serviceType)
        )
        .map(async (template) => {
          const exists = await Task.exists({
            engagement: engagement._id,
            template: template._id,
          });
          if (exists) return;
          await Task.create({
            engagement: engagement._id,
            template: template._id,
            title: template.title,
            description: template.description,
            deadline: new Date(
              Math.min(
                new Date(engagement.deadline),
                new Date(
                  new Date(engagement.startDate).getTime() +
                    template.defaultDueDays * 86400000
                )
              )
            ),
          });
        })
    )
  );
};

const list = async (req, res) => {
  await ensureDefaultServices(req.user._id);
  res.set("Cache-Control", "no-store");
  res.json({
    success: true,
    services: await ServiceType.find({ isActive: true }).sort({ name: 1 }),
  });
};
const create = async (req, res) =>
  res.status(201).json({
    success: true,
    service: await ServiceType.create({
      ...req.body,
      isDefault: false,
      createdBy: req.user._id,
    }),
  });
const remove = async (req, res) => {
  const service = await ServiceType.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true, runValidators: true }
  );
  if (!service)
    return res
      .status(404)
      .json({ success: false, message: "Service type not found" });
  await TaskTemplate.updateMany(
    { serviceType: service._id },
    { isActive: false }
  );
  res.json({ success: true, message: "Service type deleted" });
};
const addTemplate = async (req, res) => {
  const service = await ServiceType.findById(req.params.id);
  if (!service)
    return res
      .status(404)
      .json({ success: false, message: "Service type not found" });
  const template = await TaskTemplate.create({
    ...req.body,
    serviceType: service._id,
  });
  res.status(201).json({ success: true, template });
};
const templates = async (req, res) =>
  res.json({
    success: true,
    templates: await TaskTemplate.find({
      serviceType: req.params.id,
      isActive: true,
    }).sort({ sequence: 1 }),
  });
module.exports = { list, create, remove, addTemplate, templates };
