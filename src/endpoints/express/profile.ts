import express from "express";
import { body } from "express-validator";

import * as profileController from "../../controllers/express/profile.js";

import * as validation from "../../middleware/validation.js";
import * as authentication from "../../middleware/authentication.js";

import User from "../../models/user.js";

const router = express.Router();

router.get("/", authentication.authenticate_jwt, profileController.getProfile);

router.get(
  "/contacts",
  authentication.authenticate_jwt,
  profileController.getContacts
);

router.get(
  "/chats",
  authentication.authenticate_jwt,
  profileController.getChats
);

router.get(
  "/requests",
  authentication.authenticate_jwt,
  profileController.getRequests
);

router.put(
  "/password",
  [
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
  ],
  validation.validate,
  authentication.authenticate_local,
  profileController.changePass
);

router.put(
  "/email",
  [
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
  ],
  validation.validate,
  authentication.authenticate_local,
  profileController.changeEmail
);

router.put(
  "/username",
  [
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
  ],
  validation.validate,
  authentication.authenticate_local,
  profileController.changeUsername
);

export default router;
