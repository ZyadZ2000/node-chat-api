const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("../../models/user");

dotenv.config();

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.userId);
  return res.status(200).json({
    email: user.email,
    username: user.username,
    blockedList: user.blockedList,
    blockedChats: user.blockedChats,
  });
};

exports.getContacts = async (req, res) => {
  const user = await User.findById(req.userId);
  return res.status(200).json({
    contacts: user.contacts,
  });
};

exports.getRequests = async (req, res) => {
  const user = await User.findById(req.userId);
  return res.status(200).json({
    requests: user.requests,
  });
};

exports.getChats = async (req, res) => {
  const user = await User.findById(req.userId);
  return res.status(200).json({
    chats: user.chats,
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
