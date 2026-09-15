const mongoose = require("mongoose");

const statuses = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "WAITING_FOR_CLIENT",
  "READY_FOR_REVIEW",
  "CHANGES_REQUESTED",
  "COMPLETED",
];
const taskSchema = new mongoose.Schema(
  {
    engagement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Engagement",
      required: true,
    },
    template: { type: mongoose.Schema.Types.ObjectId, ref: "TaskTemplate" },
    title: { type: String, required: true, trim: true },
    description: String,
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deadline: { type: Date, required: true },
    status: { type: String, enum: statuses, default: "NOT_STARTED" },
    submittedAt: Date,
    reviewedAt: Date,
    reviewComment: String,
  },
  { timestamps: true }
);
taskSchema.index(
  { engagement: 1, template: 1 },
  { unique: true, sparse: true }
);
taskSchema.index({ assignee: 1, status: 1, deadline: 1 });
taskSchema.index({ status: 1, deadline: 1 });
module.exports = mongoose.model("Task", taskSchema);
module.exports.statuses = statuses;
