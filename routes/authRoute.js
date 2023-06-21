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
  [loginValidator, loginValidationResult],
  passport.authenticate("local", {
    failureRedirect: `${URL}/auth/login`
  }),
  (req, res) => {
    res.send({ success: true, message: 'Logged in successfully' });
  }
);

// logout
router.get('/logout', authController.logout);

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
