const _ = require("lodash");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const bcryptjs = require("bcryptjs");
const { transporter, registerData } = require("../config/mailConfig");

module.exports.register = async (req, res) => {
  try {

    // picked  necessary data
    const pickedValue = _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "password",
    ]);

    // password bcrypt and user create
    const hashedPassword = await bcryptjs.hash(pickedValue.password, 12);
    const user = await prisma.user.create({
      data: {
        ...pickedValue,
        password: hashedPassword,
      },
    });

    // generated token
    const token = await jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: false,
      },
      process.env.ACCOUNT_ACTIVATION_SECRET,
      { expiresIn: process.env.JWT_EXPIRED_TIME }
    );

    // send email
    await transporter.sendMail(registerData(user.email, token));
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
