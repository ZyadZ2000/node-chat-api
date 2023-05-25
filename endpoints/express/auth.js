const express = require("express");
const { body } = require("express-validator");
const passport = require("passport");

const authController = require("../../controllers/express/auth");

const validation = require("../../middleware/validate-sanitize");
const authentication = require("../../middleware/authentication");

const User = require("../../models/user");

const router = express.Router();

/* Google Authentication */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  authController.googleLogin
);

/* Local Authentication */
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Email address is invalid.")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      }),
    body("username")
      .isString()
      .withMessage("username must be a string.")
      .isLength({ min: 3, max: 30 })
      .withMessage("username must be at least 3 characters.")
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          return Promise.reject(
            "username exists already, please pick a different one."
          );
        }
      }),
    body("password")
      .isString()
      .withMessage("Password must be a string.")
      .isLength({ min: 6, max: 30 })
      .withMessage("Password must be at least 6 characters."),
  ],
  validation.validate,
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email address is invalid."),
    body("password")
      .isString()
      .withMessage("Password must be a string.")
      .isLength({ min: 6, max: 30 })
      .withMessage("Password must be at least 6 characters."),
  ],
  validation.validate,
  authentication.authenticate_local,
  authController.login
);

router.post(
  "/reset/password",
  [body("email").isEmail().withMessage("Email address is invalid.")],
  validation.validate,
  authController.resetPassword
);

router.post(
  "/reset/confirm",
  [
    body("email").isEmail().withMessage("Email address is invalid."),
    body("password")
      .isString()
      .withMessage("Password must be a string.")
      .isLength({ min: 6, max: 30 })
      .withMessage("Password must be at least 6 characters."),
    body("token").isString().withMessage("Invalid token"),
  ],
  validation.validate,
  authController.confirmReset
);

module.exports = router;
