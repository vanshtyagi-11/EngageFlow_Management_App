const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./configs/db.js");
const userRoutes = require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const engagementRoutes = require("./routes/engagementRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clientPortalRoutes = require("./routes/clientPortalRoutes");
const { notFound, errorHandler } = require("./middlewares/error");

// Initialize Express App
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/engagements", engagementRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/client-portal", clientPortalRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "EngageFlow API is running" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (require.main === module) startServer();

module.exports = { app, startServer };
