const express = require("express");
const passport = require('passport');
const authController = require("../controllers/authController");
const {
  registerValidator,
  registerValidationResult,
  forgetValidator,
  forgetValidationResult,
  resetValidator,
  resetValidationResult,
  loginValidator,
  loginValidationResult,
} = require("../middlewares/validators/authValidator");
const URL = require("../config/URL");
const protect = require("../middlewares/protect");
const passportLocalAuth = require("../middlewares/passportLocalAuth");

const router = express.Router();
router.post(
  "/register",
  [registerValidator, registerValidationResult],
  authController.register
);
router.get("/verify/:token", authController.verify);




// app.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, options) {

//     console.log(error, 'error') // null
//     console.log(user, 'user') // false
//     console.log(options, 'options') // message

//     if (err) {
//       return next(err); // will generate a 500 error
//     }

//     // Generate a JSON response reflecting authentication status
//     if (! user) {
//       return res.send({ success : false, message : 'authentication failed' });
//     }

//     req.login(user, loginErr => {
//       if (loginErr) {
//         return next(loginErr);
//       }
//       return res.send({ success : true, message : 'authentication succeeded' });
//     });

//   })(req, res, next);
// });




// login
router.post(
  "/login",
  [loginValidator, loginValidationResult, passportLocalAuth],
  authController.login
);


// router.post(
//   "/login",
//   [loginValidator, loginValidationResult],
//   passport.authenticate("local", {
//     failureRedirect: `/auth/login`
//   }, (error, user, options) => {

//     console.log(error, 'error') // null
//     console.log(user, 'user') // false
//     console.log(options, 'options') // message
//   }),
//   authController.login
// );


router.get('/login', authController.loginFailed);

// logout
router.get('/logout', protect, authController.logout);

router.post(
  "/forget-password",
  [forgetValidator, forgetValidationResult],
  authController.forgetPassword
);
router.get("/reset-password/:token", authController.resetVerify);
router.post(
  "/reset-password",
  [resetValidator, resetValidationResult],
  authController.reset
);

module.exports = router;
