const router = require("express").Router();
const { body } = require("express-validator");
const { protect, authorize } = require("../middlewares/auth");
const asyncHandler = require("../middlewares/asyncHandler");
const validate = require("../middlewares/validate");
const controller = require("../controllers/adminController");
router.use(protect, authorize("MANAGER", "ADMIN"));
router.get("/users", asyncHandler(controller.listUsers));
router.post(
  "/users",
  [body("email").isEmail(), body("password").isLength({ min: 8 })],
  validate,
  asyncHandler(controller.createUser)
);
router.patch("/users/:id", asyncHandler(controller.updateUser));
module.exports = router;
