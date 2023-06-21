const LocalStrategy = require("passport-local");
const bcryptjs = require("bcryptjs");
const GoogleStrategy = require("passport-google-oauth20");
// const { clientID, clientSecret } = require("./key");
const prisma = require("../lib/prisma");

const localStrategy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },

      async (email, password, next) => {
        try {

            // check user by email
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (!user) {
                return next(null, false, { message: "Invalid email or password" });
            }

            if(!user?.isVerified) {
                return next(null, false, { message: "Please verify account with your email" });
            }

            let isMatch = false;
            if (user?.password) {
                // checking password and compare password
                isMatch = await bcryptjs.compare(password, user.password);
            }

            if (isMatch) {
                return next(null, user, { message: "Logged in successfully" });
            }

            next(null, false, { message: "Invalid email or password" });
        } catch (error) {
            next(error);
        }
      }
    )
  );

  passport.serializeUser((user, next) => {
    process.nextTick(() => {
      next(null, user);
    });
  });

  passport.deserializeUser(async (user, next) => {
    try {
        const foundUser = await prisma.user.findUnique({
            where: {
                id: user?.id
            }
        })
        next(null, foundUser);
    } catch (error) {
        next(error);
    }
  });
};

// const googleStrategy = (passport) => {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID,
//         clientSecret,
//         callbackURL: `${process.env.HOST_ADDRESS}/auth/google/callback`,
//       },

//       async (accessToken, refreshToken, profile, next) => {
//         try {
//           const foundUser = await User.findOne({
//             email: profile.emails[0].value,
//             isVerified: true,
//           });

//           if (foundUser) {
//             next(null, foundUser);
//           } else {
//             const profileToSave = {
//               googleID: profile.id,
//               firstName: profile.name.givenName,
//               lastName: profile.name.familyName,
//               email: profile.emails[0].value,
//               imageURL: profile.photos[0].value,
//               isVerified: true,
//             };
//             const user = new User(profileToSave);
//             await user.save({ validateBeforeSave: false });
//             next(null, user);
//           }
//         } catch (error) {
//           next(error);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, next) => {
//     next(null, user);
//   });
//   passport.deserializeUser(async (id, next) => {
//     try {
//       const user = await User.findById(id);
//       next(null, user);
//     } catch (error) {
//       next(error);
//     }
//   });
// };

module.exports = { localStrategy };
