const express = require('express');
const authController = require("../controllers/authController");
const { registerValidator, registerValidationResult } = require('../middlewares/validators/authValidator');

const router = express.Router();
router.post("/register", [registerValidator, registerValidationResult], authController.register);
router.get('/activate/:token', authController.activate);
router.post('/login', authController.login);

module.exports = router;