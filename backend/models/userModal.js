const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "TEAM_MEMBER", "CLIENT"],
      default: "TEAM_MEMBER",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    name: { type: String, trim: true, maxlength: 80 },
    designation: { type: String, trim: true, maxlength: 80 },
    phone: { type: String, trim: true, maxlength: 25 },
    joiningDate: Date,
    clientProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (_doc, value) => {
    delete value.password;
    return value;
  },
});

module.exports = mongoose.model("User", userSchema);
