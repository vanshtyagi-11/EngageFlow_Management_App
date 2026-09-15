const Task = require("../models/taskModel");
const User = require("../models/userModal");
const audit = require("../utils/audit");
const { canManageTasks, canReview } = require("../utils/permissions");

const transitions = {
  NOT_STARTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_FOR_CLIENT", "READY_FOR_REVIEW"],
  WAITING_FOR_CLIENT: ["IN_PROGRESS"],
  READY_FOR_REVIEW: ["COMPLETED", "CHANGES_REQUESTED"],
  CHANGES_REQUESTED: ["IN_PROGRESS"],
  COMPLETED: [],
};
const list = async (req, res) => {
  const filter = canManageTasks(req.user) ? {} : { assignee: req.user._id };
  const tasks = await Task.find(filter)
    .populate("assignee engagement")
    .sort({ deadline: 1 });
  res.json({ success: true, tasks });
};
const assign = async (req, res) => {
  const assignee = await User.findOne({
    _id: req.body.assignee,
    isActive: true,
    role: "TEAM_MEMBER",
  });
  if (!assignee)
    return res
      .status(400)
      .json({
        success: false,
        message: "A valid active team member is required",
      });
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { assignee: req.body.assignee },
    { new: true, runValidators: true }
  );
  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });
  await audit(req.user._id, "TASK", task._id, "ASSIGNED", {
    assignee: req.body.assignee,
  });
  res.json({ success: true, task });
};
const transition = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task)
    return res.status(404).json({ success: false, message: "Task not found" });
  if (
    !canManageTasks(req.user) &&
    String(task.assignee) !== String(req.user._id)
  )
    return res
      .status(403)
      .json({ success: false, message: "You can update only your own tasks" });
  const nextStatus = req.body.status;
  if (!transitions[task.status]?.includes(nextStatus))
    return res
      .status(400)
      .json({
        success: false,
        message: `Invalid transition from ${task.status} to ${nextStatus}`,
      });
  if (
    ["COMPLETED", "CHANGES_REQUESTED"].includes(nextStatus) &&
    !canReview(req.user)
  )
    return res
      .status(403)
      .json({
        success: false,
        message: "Only managers can review submitted work",
      });
  task.status = nextStatus;
  if (nextStatus === "READY_FOR_REVIEW") task.submittedAt = new Date();
  if (["COMPLETED", "CHANGES_REQUESTED"].includes(nextStatus)) {
    task.reviewedAt = new Date();
    task.reviewComment = req.body.comment;
  }
  await task.save();
  await audit(req.user._id, "TASK", task._id, `STATUS_${nextStatus}`, {
    comment: req.body.comment,
  });
  res.json({ success: true, task });
};
module.exports = { list, assign, transition };
