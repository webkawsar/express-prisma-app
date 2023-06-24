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



const router = express.Router();
router.get("/users/:userId", protect, usersController.getSingle);
router.get("/users", protect, usersController.getAll);
router.post(
  "/users",
  [protect, createUserValidator, createUserValidationResult],
  usersController.create
);

router.patch(
  "/users/:userId",
  [protect, isAdminAndSupport, updateUserValidator, updateUserValidationResult],
  usersController.update
);
router.delete("/users/:userId", [protect, isAdminAndSupport], usersController.delete);


// Create a CRUD API for that user management system. Where Admin can create, read, update and delete all users. Support users can create, read, update and delete only normal users and users can create, read, update and delete themselves.

// admin => create, read, update, delete all users
// Support => create, read, update, delete only normal users
// User => create, read, update, delete themselves

module.exports = router;
