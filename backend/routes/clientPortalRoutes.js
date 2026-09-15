const router = require("express").Router();
const { protect, authorize } = require("../middlewares/auth");
const asyncHandler = require("../middlewares/asyncHandler");
const controller = require("../controllers/clientPortalController");

router.use(protect);
router.get("/summary", authorize("CLIENT"), asyncHandler(controller.summary));
router.get(
  "/requests",
  authorize("CLIENT"),
  asyncHandler(controller.listRequests)
);
router.post(
  "/requests",
  authorize("CLIENT"),
  asyncHandler(controller.createRequest)
);
router.get(
  "/manager/requests",
  authorize("MANAGER", "ADMIN"),
  asyncHandler(controller.managerRequests)
);
router.patch(
  "/manager/requests/:id",
  authorize("MANAGER", "ADMIN"),
  asyncHandler(controller.updateRequest)
);

module.exports = router;
