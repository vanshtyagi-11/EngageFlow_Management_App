const mongoose = require("mongoose");

const clientRequestSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },
    title: { type: String, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    requestedDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["REQUESTED", "IN_REVIEW", "ACCEPTED", "REJECTED"],
      default: "REQUESTED",
    },
    managerComment: { type: String, trim: true, maxlength: 1000 },
    engagement: { type: mongoose.Schema.Types.ObjectId, ref: "Engagement" },
  },
  { timestamps: true }
);

clientRequestSchema.index({ client: 1, createdAt: -1 });
module.exports = mongoose.model("ClientRequest", clientRequestSchema);
