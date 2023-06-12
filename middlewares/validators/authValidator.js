const { check, validationResult } = require('express-validator');
const prisma = require("../../lib/prisma");

const registerValidator = [
    check('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ max: 10, min: 2 })
        .withMessage('First name must be between 2 to 10 char'),

    check('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .trim()
        .isLength({ max: 10, min: 2 })
        .withMessage('Last name must be between 2 to 10 char'),

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please add valid email')
        .trim(),
    // .normalizeEmail()

    check('email').custom(async (email) => {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (user) {
            throw new Error('Email is already registered!');
        } else {
            return true;
        }
    }),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be less than 6 chars')
        .not()
        .isIn(['abc123', 'password', 'iloveyou'])
        .withMessage("Password can't set common word or text"),

    check('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .trim()
        .custom((confirmPassword, { req }) => {
            if (confirmPassword === req.body.password) {
                return true;
            }
            throw new Error("Password doesn't match");
        }),
];

const registerValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, message: errors.array()[0].msg })
    }
    next();
};


// forget password validators
const forgetValidator = [
    check('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please add valid email'),

    check('email').custom(async (value, { req }) => {
        const { email } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (user) {
            req.forgetUser = user;
            return true;
        }
        throw new Error("User doesn't exists");
    }),
];

const forgetValidationResult = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, message: errors.array()[0].msg })
    }
    next();
};


// reset password validators
const resetValidator = [
    check('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be less than 6 char')
        .not()
        .isIn(['abc123', 'password', 'iloveyou'])
        .withMessage("Password can't set common word or text"),

    check('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .trim()
        .custom((confirmPassword, { req }) => {
            if (confirmPassword === req.body.password) {
                return true;
            }
            throw new Error("Password doesn't match");
        }),
];

const resetValidationResult = async (req, res, next) => {
    const errors = validationResult(req);
    const { token } = req.body;
    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, message: errors.array()[0].msg })
    }
    next();
};


module.exports = {
    registerValidator,
    registerValidationResult,
    forgetValidator,
    forgetValidationResult,
    resetValidator,
    resetValidationResult
}