const _ = require("lodash");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const bcryptjs = require("bcryptjs");
const { transporter, register, forgetEmail } = require("../config/mailConfig");
const generateAuthToken = require("../helpers/generateAuthToken");

module.exports.register = async (req, res, next) => {
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

    // generate token for 1440 minute or 1 day
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
    await transporter.sendMail(register(user.email, token));
    res.status(201).send({
      success: true,
      message: "Please verify the account with your email",
    });
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  const { token } = req.params;
  jwt.verify(
    token,
    process.env.ACCOUNT_VERIFICATION_SECRET,
    async (error, decoded) => {
      if (error) {
        return res.status(400).send({
          success: false,
          message: "Account verification failed. Please try again",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          email: decoded?.email,
        },
      });

      if (!user.isVerified) {
        await prisma.user.update({
          data: {
            isVerified: true,
          },
          where: {
            email: decoded?.email,
          },
        });

        return res.send({
          success: true,
          message: "Account verification successful. Please login",
        });
      }

      res.send({
        success: true,
        message: "Account already verified. Please login",
      });
    }
  );
};

module.exports.login = async (req, res, next) => {
  const user = { ...req.user };

  // delete unnecessary field from user
  delete user.password;
  delete user.resetToken;

  res.send({ success: true, user });
};

exports.forgetPassword = async (req, res, next) => {
  try {
    // generate token
    const token = await jwt.sign(
      {
        firstName: req.forgetUser.firstName,
        lastName: req.forgetUser.lastName,
        email: req.forgetUser.email,
      },
      process.env.FORGET_SECRET,
      { expiresIn: process.env.FORGET_JWT_EXPIRED_TIME }
    );

    // set user reset token
    await prisma.user.update({
      where: {
        email: req?.forgetUser?.email,
      },
      data: {
        resetToken: token,
      },
    });

    // send email
    await transporter.sendMail(forgetEmail(req?.forgetUser?.email, token));
    res.send({
      success: true,
      message:
        "Reset password link was sent to your email. Please follow the instructions",
    });
  } catch (error) {
    // set user reset token null
    await prisma.user.update({
      where: {
        email: req?.forgetUser?.email,
      },
      data: {
        resetToken: null,
      },
    });

    next(error);
  }
};

exports.resetVerify = (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.FORGET_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(400).send({
        success: false,
        message: "Password reset verification failed. Please try again",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: decoded?.email,
      },
    });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Password reset verification failed. Please try again",
      });
    }

    res.send({ success: true, message: "Password reset verification success" });
  });
};

exports.reset = (req, res, next) => {
  // picked  necessary data
  const pickedData = _.pick(req.body, ["password", "token"]);

  jwt.verify(
    pickedData.token,
    process.env.FORGET_SECRET,
    async (error, decoded) => {
      if (error) {
        return res.status(400).send({
          success: false,
          message: "Password reset failed. Please try again",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          email: decoded?.email,
        },
      });

      if (!user) {
        return res.status(400).send({
          success: false,
          message: "Password reset failed. Please try again",
        });
      }

      const hashedPassword = await bcryptjs.hash(pickedData.password, 12);
      await prisma.user.update({
        where: {
          email: decoded?.email,
        },
        data: {
          resetToken: null,
          password: hashedPassword,
        },
      });

      res.send({
        success: true,
        message: "Reset password successfully. Please login",
      });
    }
  );
};

exports.logout = async (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    res.send({ success: true, message: "Logout successful" });
  });
};
