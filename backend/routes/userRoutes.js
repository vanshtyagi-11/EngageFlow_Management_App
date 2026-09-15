const express = require("express");
const { signup, login, me } = require("../controllers/userController");
const { protect } = require("../middlewares/auth");
const asyncHandler = require("../middlewares/asyncHandler");
const validate = require("../middlewares/validate");
const { body } = require("express-validator");

const userRouter = express.Router();

const signupRules = [
  body("username").trim().isLength({ min: 3, max: 30 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("rePassword").custom((value, { req }) => value === req.body.password),
];
const loginRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

userRouter.post("/signup", signupRules, validate, asyncHandler(signup));
userRouter.post("/login", loginRules, validate, asyncHandler(login));
userRouter.get("/me", protect, asyncHandler(me));

module.exports = userRouter;
