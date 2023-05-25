const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const LocalStrategy = require("passport-local").Strategy;
//const JwtStrategy = require("passport-jwt").Strategy;
//const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const crypto = require("crypto");
const util = require("util");

const User = require("./models/user");

const passportStrategies = () => {
  // passport.use(
  //   new LocalStrategy(
  //     {
  //       usernameField: "email",
  //       passwordField: "password",
  //     },
  //     async (email, password, done) => {
  //       try {
  //         const user = await User.findOne({ email });

  //         if (!user) {
  //           return done(null, false, {
  //             message: "Incorrect email or password.",
  //           });
  //         }

  //         const isMatch = await bcrypt.compare(password, user.password);

  //         if (!isMatch) {
  //           return done(null, false, {
  //             message: "Incorrect email or password.",
  //           });
  //         }

  //         return done(null, user);
  //       } catch (err) {
  //         return done(err);
  //       }
  //     }
  //   )
  // );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async function (_, __, profile, done) {
        try {
          const email = profile._json.email;
          const user = await User.findOne({ email: email });
          if (user) return done(null, user);
          const randomBytesAsync = util.promisify(crypto.randomBytes);
          const password = await randomBytesAsync(32);
          const hashedPassword = await bcrypt.hash(
            password.toString("hex"),
            Number(process.env.BCRYPT_SALT_ROUNDS)
          );
          const newUser = new User({
            email: email,
            password: hashedPassword,
            username: uuidv4(),
          });
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // passport.use(
  //   new JwtStrategy(
  //     {
  //       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //       secretOrKey: process.env.JWT_SECRET,
  //     },
  //     (jwtPayload, done) => {
  //       User.findById(jwtPayload.sub)
  //         .then((user) => {
  //           if (user) {
  //             return done(null, user);
  //           } else {
  //             return done(null, false);
  //           }
  //         })
  //         .catch((err) => done(err, false));
  //     }
  //   )
  // );
};

module.exports = passportStrategies;
