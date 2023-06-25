const express = require("express");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");
const {
  registerValidator,
  registerValidationResult,
} = require("../middlewares/validators/authValidator");
const protect = require("../middlewares/protect");
const {
  updateUserValidator,
  updateUserValidationResult,
  addUserValidator,
  addUserValidationResult,
} = require("../middlewares/validators/userValidator");
const { addPermission, editAndDeletePermission } = require("../middlewares/permission");


const router = express.Router();
router.get("/users/:userId", protect, usersController.getSingle);
router.get("/users", protect, usersController.getAll);
router.post(
  "/users",
  [protect, addPermission, addUserValidator, addUserValidationResult],
  usersController.addUser
);

router.patch(
  "/users/:userId",
  [protect, editAndDeletePermission, updateUserValidator, updateUserValidationResult],
  usersController.update
);
router.delete(
  "/users/:userId",
  [protect, editAndDeletePermission],
  usersController.delete
);

module.exports = router;
