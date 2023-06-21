const passport = require('passport');

const passportLocalAuth = (req, res, next) => {
    passport.authenticate('local', (error, user, options) => {

      if (error) {
        return next(error); // will generate a 500 error
      }
  
      // Generate a JSON response reflecting authentication status
      if (!user) {
        return res.status(400).send({ success: false, message: options?.message });
      }
  
      req.login(user, loginErr => {

        if (loginErr) {
          return next(loginErr);
        }

        next();
      });
  
    })(req, res, next);
}

module.exports = passportLocalAuth;