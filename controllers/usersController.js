const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const _ = require("lodash");
const crypto = require("crypto");
const {
  transporter,
  registerData,
  forgetData,
  userEmailData,
} = require("../config/mailConfig");
const generateAuthToken = require("../helpers/generateAuthToken");


module.exports.create = async (req, res) => {
  try {

    // picked  necessary data
    const pickedValue = _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "role"
    ]);

    // password bcrypt and user create
    const password = crypto.randomBytes(5).toString('hex');
    const hashedPassword = await bcryptjs.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        ...pickedValue,
        password: hashedPassword,
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
      process.env.ACCOUNT_ACTIVATION_SECRET,
      { expiresIn: process.env.REGISTER_JWT_EXPIRED_TIME }
    );

    // send email
    await transporter.sendMail(userEmailData(user.email, token, password));
    res.status(201).send({
      success: true,
      message: "Please check your email and activate account",
    });

  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getAll = async (req, res) => {
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
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports.getSingle = async (req, res) => {
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
    res.send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports.update = async (req, res) => {
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

    // checking user exists or not
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User doesn't exists" });
    }

    // checking permission
    if (req.user?.role === "User" && req.user?.id !== user.id) {
        return res
        .status(403)
        .send({
            success: false,
            message: "You are not allowed to perform the action",
        });
    }

    if (
        req.user?.role === "Support" &&
        (user.role === "Admin" ||
        (user.role === "Support" && req.user?.id !== user.id))
    ) {
        return res
        .status(403)
        .send({
            success: false,
            message: "You are not allowed to perform the action",
        });
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
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { userId } = req.params;

    // checking user exists or not
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User doesn't exists" });
    }

    // checking permission
    if (req.user?.role === "User" && req.user?.id !== user.id) {
      return res
        .status(403)
        .send({
          success: false,
          message: "You are not allowed to perform the action",
        });
    }

    if (
      req.user?.role === "Support" &&
      (user.role === "Admin" ||
        (user.role === "Support" && req.user?.id !== user.id))
    ) {
      return res
        .status(403)
        .send({
          success: false,
          message: "You are not allowed to perform the action",
        });
    }

    // delete user
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    res.send({ success: true, user: deletedUser });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
