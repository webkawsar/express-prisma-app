const nodemailer = require("nodemailer");
const URL = require("./URL");
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD, 
    },
});


const register = (to, token) => {

    return {
        from: process.env.SMTP_USERNAME,
        to,
        subject: 'Welcome to Express Prisma App',
        text: `Welcome from Express Prisma App.Please click the link to verify your account <a href="${URL}/account/verify?token=${token}">Verify account</a>`,
        html: `<h3>Welcome from Express Prisma App</h3><p>Please click the link to verify your account <a href="${URL}/account/verify?token=${token}">Verify account</a></p>`,
    }
};

const forgetData = (to, token) => ({
    from: process.env.SMTP_USERNAME,
    to,
    subject: 'Reset Password',
    text: `You requested to reset password.Please click the link to reset password <a href="${URL}/auth/reset-password/${token}">Reset Password</a>`,
    html: `<p>You requested to reset password.Please click the link to reset password <a href="${URL}/auth/reset-password/${token}">Reset Password</a></p>`,
});

const userEmail = (to, token, password) => ({
    from: process.env.SMTP_USERNAME,
    to,
    subject: 'Welcome to Express Prisma App',
    text: `Welcome from Express Prisma App. Please click the link to verify your account <a href="${URL}/account/verify?token=${token}">Verify account</a>`,
    html: `<h3>Welcome from Express Prisma App</h3><p>Please click the link to verify your account <a href="${URL}/account/verify?token=${token}">Verify account</a></p> <h3>Your password is: <b>${password}</b></h3>`,
});

module.exports = {
    transporter,
    register,
    forgetData,
    userEmail
};
