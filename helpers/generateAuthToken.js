const jwt = require("jsonwebtoken");

const generateAuthToken = async (user) => {
  const token = await jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.ACCOUNT_LOGIN_SECRET,
    { expiresIn: process.env.LOGIN_JWT_EXPIRED_TIME }
  );
  return token;
};

module.exports = generateAuthToken;
