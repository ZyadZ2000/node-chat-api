const express = require("express");
const { body } = require("express-validator");
const passport = require("passport");

const userController = require("../controllers/user");
const { validate, sanitize } = require("../middleware/validate-sanitize");
const User = require("../models/user");

const router = express.Router();

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.getProfile
);

router.put(
  "/change-password",
  sanitize,
  body("email").isEmail().withMessage("Email address is invalid."),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be at least 6 characters."),
  body("new_password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be at least 6 characters."),
  validate,
  userController.changePass
);

router.put(
  "/change-email",
  sanitize,
  body("email").isEmail().withMessage("Email address is invalid."),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be at least 6 characters."),
  body("new_email")
    .isEmail()
    .withMessage("Email address is invalid")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject(
          "E-Mail exists already, please pick a different one."
        );
      }
    }),
  validate,
  userController.changeEmail
);

router.put(
  "/change-username",
  sanitize,
  body("email").isEmail().withMessage("Email address is invalid."),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be at least 6 characters."),
  body("new_username")
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
  validate,
  userController.changeUsername
);

module.exports = router;
