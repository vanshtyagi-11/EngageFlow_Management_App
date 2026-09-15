const mongoose = require("mongoose");

const taskTemplateSchema = new mongoose.Schema(
  {
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: String,
    defaultDueDays: { type: Number, min: 0, default: 7 },
    sequence: { type: Number, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
taskTemplateSchema.index({ serviceType: 1, sequence: 1 });
module.exports = mongoose.model("TaskTemplate", taskTemplateSchema);
