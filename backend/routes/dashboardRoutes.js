const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const { protect } = require("../middlewares/auth");
const { summary } = require("../controllers/dashboardController");
router.get("/summary", protect, asyncHandler(summary));
module.exports = router;
