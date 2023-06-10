const express = require('express');
const authController = require("../controllers/authController");
const { registerValidator, registerValidationResult, forgetValidator, forgetValidationResult, resetValidator, resetValidationResult } = require('../middlewares/validators/authValidator');


const router = express.Router();
router.post("/register", [registerValidator, registerValidationResult], authController.register);
router.get('/activate/:token', authController.activate);
router.post('/login', authController.login);
router.post('/forget-password', [forgetValidator, forgetValidationResult], authController.forgetPassword);
router.get('/reset-password/:token', authController.resetVerify);
router.post('/reset-password', [resetValidator, resetValidationResult], authController.reset);


module.exports = router;