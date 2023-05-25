const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("../models/user");

dotenv.config();

exports.getProfile = (req, res) => {
  return res.status(200).json({
    email: req.user.email,
    username: req.user.username,
    blockedList: req.user.blockedList,
    blockedChats: req.user.blockedChats,
  });
};

exports.getContacts = (req, res) => {
  return res.status(200).json({
    contacts: req.user.contacts,
  });
};

exports.getRequests = (req, res) => {
  return res.status(200).json({
    requests: req.user.requests,
  });
};

exports.getChats = (req, res) => {
  return res.status(200).json({
    chats: req.user.chats,
  });
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
