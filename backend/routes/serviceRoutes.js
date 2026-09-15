const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const { protect, authorize } = require("../middlewares/auth");
const controller = require("../controllers/serviceController");
router.use(protect);
router.get("/", asyncHandler(controller.list));
router.post(
  "/",
  authorize("MANAGER", "ADMIN"),
  asyncHandler(controller.create)
);
router.delete(
  "/:id",
  authorize("MANAGER", "ADMIN"),
  asyncHandler(controller.remove)
);
router.post(
  "/:id/templates",
  authorize("MANAGER", "ADMIN"),
  asyncHandler(controller.addTemplate)
);
router.get("/:id/templates", asyncHandler(controller.templates));
module.exports = router;
