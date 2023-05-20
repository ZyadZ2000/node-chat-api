const express = require("express");
const { body } = require("express-validator");
const passport = require("passport");

const chatController = require("../controllers/chat");
const { validate, sanitize } = require("../middleware/validate-sanitize");
const User = require("../models/user");

const router = express.Router();

router.get("/chat/messages");

router.get("/chat/members");

router.post("/chat/request");

router.post("/chat/create");

router.post("/chat/join");

router.post("/chat/members/add");

router.put("/chat/members/remove");

router.delete("/chat");

module.exports = router;
