const mongoose = require("mongoose");

const serviceTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    recurrence: {
      type: String,
      enum: ["ONE_TIME", "MONTHLY", "QUARTERLY", "YEARLY"],
      default: "ONE_TIME",
    },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ServiceType", serviceTypeSchema);
