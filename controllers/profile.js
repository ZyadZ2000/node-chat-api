const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("../models/user");

dotenv.config();

exports.getProfile = (req, res) => {
  return res.status(200).json({
    email: req.user.email,
    username: req.user.username,
    blockedList: req.user.blockedList,
  });
};

exports.getContacts;

exports.getRequests;

exports.getBlockedUsers;

exports.getBlockedChats;

exports.getChats;

exports.changePass = async (req, res, next) => {
  try {
    const { email, password, new_password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "Not a valid email" });
    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: "Authentication failed" });
    user.password = await bcrypt.hash(
      new_password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    await user.save();
    return res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const { email, password, new_email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "Not a valid email" });
    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: "Authentication failed" });
    user.email = new_email;
    await user.save();
    return res.status(201).json({ message: "Email changed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.changeUsername = async (req, res) => {
  try {
    const { email, password, new_username } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "Not a valid email" });
    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: "Authentication failed" });
    user.username = new_username;
    await user.save();
    return res.status(201).json({ message: "username changed successfully" });
  } catch (error) {
    next(error);
  }
};
