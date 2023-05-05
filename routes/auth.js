const express = require("express");
const { body } = require("express-validator");
const passport = require("passport");

const authController = require("../controllers/auth");
const { validate, sanitize } = require("../middleware/validate-sanitize");

const router = express.Router();

/* Local Authentication */
router.post(
  "/register",
  sanitize,
  [
    body("email")
      .isEmail()
      .withMessage("Email address is invalid.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      }),
    body("password")
      .isString()
      .withMessage("Password must be a string.")
      .isLength({ min: 6, max: 30 })
      .withMessage("Password must be at least 6 characters."),
  ],
  validate,
  authController.register
);

router.post(
  "/login",
  sanitize,
  [
    body("email").isEmail().withMessage("Email address is invalid."),
    body("password")
      .isString()
      .withMessage("Password must be a string.")
      .isLength({ min: 6, max: 30 })
      .withMessage("Password must be at least 6 characters."),
  ],
  validate,
  authController.login
);

router.post("/reset-password", authController.resetPassword);

router.post("/confirm-reset", authController.confirmReset);

/* Google Authentication */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/error",
    session: false,
  }),
  authController.googleLogin
);

module.exports = router;
