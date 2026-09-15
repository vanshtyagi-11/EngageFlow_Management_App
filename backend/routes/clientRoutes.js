const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const { protect, authorize } = require("../middlewares/auth");
const controller = require("../controllers/clientController");
router.use(protect);
router.get("/", asyncHandler(controller.list));
router.post(
  "/",
  authorize("ADMIN", "MANAGER"),
  asyncHandler(controller.create)
);
router.patch(
  "/:id",
  authorize("ADMIN", "MANAGER"),
  asyncHandler(controller.update)
);
module.exports = router;
