const { check, validationResult } = require("express-validator");
const prisma = require("../../lib/prisma");

const addUserValidator = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({ max: 20, min: 2 })
    .withMessage("First name must be between 2 to 20 char"),

  check("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .isLength({ max: 20, min: 2 })
    .withMessage("Last name must be between 2 to 20 char"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please add valid email")
    .trim(),
  // .normalizeEmail()

  check("email").custom(async (email) => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      throw new Error("Email is already registered!");
    } else {
      return true;
    }
  }),
];

const addUserValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send({ success: false, message: errors.array()[0].msg });
  }
  next();
};

const updateUserValidator = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({ max: 20, min: 2 })
    .withMessage("First name must be between 2 to 20 char"),

  check("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .isLength({ max: 20, min: 2 })
    .withMessage("Last name must be between 2 to 20 char"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please add valid email")
    .trim(),
  // .normalizeEmail()

  check("email").custom(async (email, { req }) => {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return true;
    } else if (user) {

      if ((req.user?.role === "Admin" || req.user?.role === "Support") && user?.id !== Number(req.params?.userId)) {
        throw new Error("This email is associated with another account");
      } else if ((req.user?.role === "Admin" || req.user?.role === "Support") && user?.id === Number(req.params?.userId)) {
        return true;
      } else if (req.user?.email === email) {
        return true;
      } else {
        throw new Error("This email is associated with another account");
      }

    } else {
      throw new Error("This email is associated with another account");
    }
  }),
];

const updateUserValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send({ success: false, message: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  addUserValidator,
  addUserValidationResult,
  updateUserValidator,
  updateUserValidationResult,
};
