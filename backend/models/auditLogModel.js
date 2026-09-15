const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    entityType: {
      type: String,
      enum: ["ENGAGEMENT", "TASK", "CLIENT", "USER"],
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
module.exports = mongoose.model("AuditLog", auditLogSchema);
