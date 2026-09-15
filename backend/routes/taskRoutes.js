const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const { protect, authorize } = require("../middlewares/auth");
const controller = require("../controllers/taskController");
router.use(protect);
router.get("/", asyncHandler(controller.list));
router.patch(
  "/:id/assignee",
  authorize("ADMIN", "MANAGER"),
  asyncHandler(controller.assign)
);
router.patch("/:id/status", asyncHandler(controller.transition));
module.exports = router;
