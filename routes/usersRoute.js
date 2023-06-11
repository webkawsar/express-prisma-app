const express = require('express');
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");
const { registerValidator, registerValidationResult } = require('../middlewares/validators/authValidator');


const router = express.Router();
router.get("/users/:userId", usersController.getSingle);
router.get("/users", usersController.getAll);
router.post("/users", [registerValidator, registerValidationResult], authController.register);
router.patch("/users/:userId", usersController.update);
router.delete("/users/:userId", usersController.delete);


module.exports = router;