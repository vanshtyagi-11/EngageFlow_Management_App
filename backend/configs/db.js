const mongoose = require("mongoose");

let connectionPromise;

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) return;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });
    await connectionPromise;
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
