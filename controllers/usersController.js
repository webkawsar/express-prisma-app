const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const _ = require("lodash");
const crypto = require("crypto");
const {
  transporter,
  registerData,
  forgetData,
  userEmail,
} = require("../config/mailConfig");
const generateAuthToken = require("../helpers/generateAuthToken");

module.exports.addUser = async (req, res, next) => {
  try {
    // picked  necessary data
    const pickedData = _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "role",
    ]);

    // Support can add only User
    if (req.user.role === "Support") {
      pickedData.role = "User";
    }

    // password bcrypt and user create
    const password = crypto.randomBytes(5).toString("hex");
    const hashedPassword = await bcryptjs.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        ...pickedData,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    // generate token
    const token = await jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: false,
      },
      process.env.ACCOUNT_VERIFICATION_SECRET,
      { expiresIn: process.env.ACCOUNT_VERIFICATION_EXPIRED_TIME }
    );

    // send email
    await transporter.sendMail(userEmail(user.email, token, password));
    res.status(201).send({
      success: true,
      user,
      message: "The user added successfully, email sent with the password",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAll = async (req, res, next) => {
  try {
    // cursor => mane jekoyta take korbe first e, second time e first time er last ta show abar ei koyta take korbe
    // distinct
    // orderBy => sorting er jonno
    // select => mane specific field select kore show kora jabe
    // skip => mane koyta skip kore jabe
    // take => mane koyta dibe
    // where => searching requirements
    // include => relation field kore populate kore show kore

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    res.send({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports.getSingle = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.send({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // picked  necessary data
    const pickedData = _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "role",
    ]);

    // role can change only admin
    if (req.user?.role === "Support" || req.user?.role === "User") {
      delete pickedData.role;
    }

    // update user
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        ...pickedData,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    res.send({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // delete user
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    if (req.user?.id === Number(userId)) {
      req.logout((error) => {
        if (error) {
          return next(error);
        }
      });
    }

    res.send({ success: true, user: deletedUser });
  } catch (error) {
    next(error);
  }
};
