const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const { protect, authorize } = require("../middlewares/auth");
const controller = require("../controllers/engagementController");
router.use(protect);
router.get("/", asyncHandler(controller.list));
router.post(
  "/",
  authorize("ADMIN", "MANAGER"),
  asyncHandler(controller.create)
);
router.post(
  "/:id/next-period",
  authorize("ADMIN", "MANAGER"),
  asyncHandler(controller.nextPeriod)
);
module.exports = router;
