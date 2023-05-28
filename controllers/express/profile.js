const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("../../models/user");
const Request = require("../../models/request");
const Chat = require("../../models/chat");

dotenv.config();

exports.getProfile = async (req, res, next) => {
  try {
    Chat.init();
    const user = await User.findById(req.userId)
      .populate({ path: "blockedUsers", select: "username _id" })
      .populate({ path: "blockedChats", select: "name _id" });
    return res.status(200).json({
      email: user.email,
      username: user.username,
      blockedUsers: user.blockedUsers,
      blockedChats: user.blockedChats,
    });
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "contacts",
      select: "username _id",
    });
    return res.status(200).json({
      contacts: user.contacts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRequests = async (req, res) => {
  try {
    // Register the Request model with Mongoose
    Request.init();
    const user = await User.findById(req.userId).populate({
      path: "requests",
      options: { autoCreate: true },
    });
    return res.status(200).json({
      requests: user.requests,
    });
  } catch (error) {
    next(error);
  }
};

exports.getChats = async (req, res) => {
  try {
    Chat.init();
    const user = await User.findById(req.userId).populate({
      path: "chats",
      select: "name _id",
    });
    return res.status(200).json({
      chats: user.chats,
    });
  } catch (error) {
    next(error);
  }
};

exports.changePass = async (req, res, next) => {
  try {
    const { new_password } = req.body;
    req.user.password = await bcrypt.hash(
      new_password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    await req.user.save();
    return res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const { new_email } = req.body;
    req.user.email = new_email;
    await req.user.save();
    return res.status(201).json({ message: "Email changed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.changeUsername = async (req, res) => {
  try {
    const { new_username } = req.body;
    req.user.username = new_username;
    await req.user.save();
    return res.status(201).json({ message: "username changed successfully" });
  } catch (error) {
    next(error);
  }
};
