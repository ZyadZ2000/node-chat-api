const express = require("express");

const { body } = require("express-validator");

const userController = require("../controllers/user");
const { validate, sanitize } = require("../middleware/validate-sanitize");

const router = express.Router();

/* The client should send his username, password, and the new password */
router.put("/change-password", authController.changePass);

router.put("/change-email", authController.changeEmail);

router.put("/change-username", authController.changeUsername);
