const _ = require("lodash");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const bcryptjs = require("bcryptjs");
const {
  transporter,
  registerData,
  forgetData,
} = require("../config/mailConfig");
const generateAuthToken = require("../helpers/generateAuthToken");

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

exports.activate = async (req, res) => {
  const { token } = req.params;
  jwt.verify(
    token,
    process.env.ACCOUNT_ACTIVATION_SECRET,
    async (error, decoded) => {

      if (error) {
        return res.status(400).send({
          success: false,
          message: "Account activation failed.Please try again",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      if (!user.isVerified) {
        await prisma.user.update({
          data: {
            isVerified: true,
          },
          where: {
            email: decoded.email,
          },
        });

        return res.send({
          success: true,
          message: "Account activate successfully.Please login",
        });
      }

      res.send({
        success: true,
        message: "Account already activated.Please login",
      });
    }
  );
};

module.exports.login = async (req, res) => {
  try {

    // picked necessary data
    const pickedData = _.pick(req.body, ["email", "password"]);

    // checking user exist or not
    const user = await prisma.user.findUnique({
      where: {
        email: pickedData.email,
      },
    });

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid email or password" });
    }

    if(!user.isVerified) {
      return res
        .status(400)
        .send({ success: false, message: "Account is not activated" });
    }

    // compare password
    const isMatched = await bcryptjs.compare(
      pickedData.password,
      user.password
    );

    if (!isMatched) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid email or password" });
    }

    //generate auth token
    const token = await generateAuthToken(user);
    res.send({ success: true, token, user });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.forgetPassword = async (req, res) => {
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
        resetToken: token
      }
    });

    // send email
    await transporter.sendMail(forgetData(req?.forgetUser?.email, token));
    res.send({
      success: true,
      message:
        "Reset password link was sent to your email. Please follow the instructions",
      token
    });

  } catch (error) {

    // set user reset token null
    await prisma.user.update({
      where: {
        email: req?.forgetUser?.email,
      },
      data: {
        resetToken: null
      }
    });

    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.resetVerify = (req, res) => {
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
        email: decoded.email,
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

exports.reset = (req, res) => {
  jwt.verify(
    req.body.token,
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
          email: decoded.email,
        },
      });

      if (!user) {
        return res.status(400).send({
          success: false,
          message: "Password reset failed. Please try again",
        });
      }

      const hashedPassword = await bcryptjs.hash(req.body.password, 12);
      await prisma.user.update({
        where: {
          email: decoded.email,
        },
        data: {
          resetToken: null,
          password: hashedPassword,
        }
      });

      res.send({
        success: true,
        message: "Reset password successfully. Please login",
      });
    }
  );
};
