const { check, validationResult } = require('express-validator');
const prisma = require("../../lib/prisma");

const createUserValidator = [
    check('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ max: 20, min: 2 })
        .withMessage('First name must be between 2 to 20 char'),

    check('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .trim()
        .isLength({ max: 20, min: 2 })
        .withMessage('Last name must be between 2 to 20 char'),

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
    })
];

const createUserValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, message: errors.array()[0].msg })
    }
    next();
};

const updateUserValidator = [
    check('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ max: 20, min: 2 })
        .withMessage('First name must be between 2 to 20 char'),

    check('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .trim()
        .isLength({ max: 20, min: 2 })
        .withMessage('Last name must be between 2 to 20 char'),

    // check('email')
    //     .notEmpty()
    //     .withMessage('Email is required')
    //     .isEmail()
    //     .withMessage('Please add valid email')
    //     .trim(),
    // .normalizeEmail()

    // check('email').custom(async (email) => {
    //     const user = await prisma.user.findUnique({
    //         where: {
    //             email
    //         }
    //     })
    //     if (user) {
    //         throw new Error('Email is already registered!');
    //     } else {
    //         return true;
    //     }
    // })
];

const updateUserValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, message: errors.array()[0].msg })
    }
    next();
};


module.exports = {
    createUserValidator,
    createUserValidationResult,
    updateUserValidator,
    updateUserValidationResult
}