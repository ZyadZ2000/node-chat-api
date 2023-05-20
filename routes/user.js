const express = require("express");
const { body } = require("express-validator");
const passport = require("passport");

const userController = require("../controllers/user");
const { validate, sanitize } = require("../middleware/validate-sanitize");
const User = require("../models/user");

const router = express.Router();

router.post("/request-user");

router.post("/accept-user");

router.post("/decline-user");

router.post("/block-user");

router.post("/remove-user");

module.exports = router;
