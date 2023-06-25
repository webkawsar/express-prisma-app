const express = require("express");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");
const {
  registerValidator,
  registerValidationResult,
} = require("../middlewares/validators/authValidator");
const protect = require("../middlewares/protect");
const {
  createUserValidator,
  createUserValidationResult,
  updateUserValidator,
  updateUserValidationResult,
} = require("../middlewares/validators/userValidator");
const isAdminAndSupport = require("../middlewares/isAdminAndSupport");
const isPermission = require("../middlewares/isPermission");

const router = express.Router();
router.get("/users/:userId", protect, usersController.getSingle);
router.get("/users", protect, usersController.getAll);
router.post(
  "/users",
  [protect, isPermission, createUserValidator, createUserValidationResult],
  usersController.addUser
);

router.patch(
  "/users/:userId",
  [protect, isAdminAndSupport, updateUserValidator, updateUserValidationResult],
  usersController.update
);
router.delete(
  "/users/:userId",
  [protect, isAdminAndSupport],
  usersController.delete
);

module.exports = router;
