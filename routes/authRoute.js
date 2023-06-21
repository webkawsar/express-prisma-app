const express = require("express");
const passport = require('passport');
const authController = require("../controllers/authController");
const {
  registerValidator,
  registerValidationResult,
  forgetValidator,
  forgetValidationResult,
  resetValidator,
  resetValidationResult,
  loginValidator,
  loginValidationResult,
} = require("../middlewares/validators/authValidator");
const URL = require("../config/URL");
const protect = require("../middlewares/protect");
const passportLocalAuth = require("../middlewares/passportLocalAuth");

const router = express.Router();
router.post(
  "/register",
  [registerValidator, registerValidationResult],
  authController.register
);
router.get("/verify/:token", authController.verify);

// login
router.post(
  "/login",
  [loginValidator, loginValidationResult, passportLocalAuth],
  authController.login
);

// logout
router.get('/logout', protect, authController.logout);

router.post(
  "/forget-password",
  [forgetValidator, forgetValidationResult],
  authController.forgetPassword
);
router.get("/reset-password/:token", authController.resetVerify);
router.post(
  "/reset-password",
  [resetValidator, resetValidationResult],
  authController.reset
);

module.exports = router;
