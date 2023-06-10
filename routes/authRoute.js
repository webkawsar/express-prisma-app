const express = require('express');
const authController = require("../controllers/authController");
const { registerValidator, registerValidationResult, forgetValidator, forgetValidationResult } = require('../middlewares/validators/authValidator');

const router = express.Router();
router.post("/register", [registerValidator, registerValidationResult], authController.register);
router.get('/activate/:token', authController.activate);
router.post('/login', authController.login);
router.post('/forget-password', [forgetValidator, forgetValidationResult], authController.forgetPassword);

module.exports = router;