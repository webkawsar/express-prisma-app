const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD, 
    },
});

const isDevelopment = process.env.NODE_ENV === 'development';
const HOST_ADDRESS = isDevelopment ? process.env.HOST_ADDRESS || process.env.RAILWAY_URL;

const registerData = (to, token) => ({
    from: process.env.SMTP_USERNAME,
    to,
    subject: 'Welcome to Express Prisma App',
    text: `Welcome from Express Prisma App.Please click the link to activate your account <a href="${HOST_ADDRESS}/auth/activate/${token}">Activate account</a>`,
    html: `<h3>Welcome from Express Prisma App</h3><p>Share your idea to the outer world</p><p>Please click the link to activate your account <a href="${HOST_ADDRESS}/auth/activate/${token}">Activate account</a></p>`,
});

const forgetData = (to, token) => ({
    from: process.env.SMTP_USERNAME,
    to,
    subject: 'Reset Password',
    text: `You requested to reset password.Please click the link to reset password <a href="${HOST_ADDRESS}/auth/reset-password/${token}">Reset Password</a>`,
    html: `<p>You requested to reset password.Please click the link to reset password <a href="${HOST_ADDRESS}/auth/reset-password/${token}">Reset Password</a></p>`,
});

const userEmailData = (to, token, password) => ({
    from: process.env.SMTP_USERNAME,
    to,
    subject: 'Welcome to Express Prisma App',
    text: `Welcome from Express Prisma App.Please click the link to activate your account <a href="${HOST_ADDRESS}/auth/activate/${token}">Activate account</a>`,
    html: `<h3>Welcome from Express Prisma App</h3><p>Share your idea to the outer world</p><p>Please click the link to activate your account <a href="${HOST_ADDRESS}/auth/activate/${token}">Activate account</a></p> <h3>Your password is: <b>${password}</b></h3>`,
});

module.exports = {
    transporter,
    registerData,
    forgetData,
    userEmailData
};
