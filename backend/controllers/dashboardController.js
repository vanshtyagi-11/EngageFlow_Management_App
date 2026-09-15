const Task = require("../models/taskModel");
const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};
const summary = async (req, res) => {
  const scope = ["ADMIN", "MANAGER"].includes(req.user.role)
    ? {}
    : { assignee: req.user._id };
  const today = startOfToday();
  const [open, overdue, dueToday, waitingClient, waitingReview] =
    await Promise.all([
      Task.countDocuments({ ...scope, status: { $ne: "COMPLETED" } }),
      Task.countDocuments({
        ...scope,
        status: { $ne: "COMPLETED" },
        deadline: { $lt: today },
      }),
      Task.countDocuments({
        ...scope,
        status: { $ne: "COMPLETED" },
        deadline: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
      }),
      Task.countDocuments({ ...scope, status: "WAITING_FOR_CLIENT" }),
      Task.countDocuments({ ...scope, status: "READY_FOR_REVIEW" }),
    ]);
  res.json({
    success: true,
    metrics: { open, overdue, dueToday, waitingClient, waitingReview },
  });
};
module.exports = { summary };
