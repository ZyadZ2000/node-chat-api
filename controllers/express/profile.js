const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("../../models/user");
const Request = require("../../models/request");
const Chat = require("../../models/chat");

dotenv.config();

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const blockedUsersPromises = Array.from(user.blockedUsers.keys()).map(
      (userId) => User.findById(userId).select("username _id")
    );
    const blockedChatsPromises = Array.from(user.blockedChats.keys()).map(
      (chatId) => Chat.findById(chatId).select("name _id")
    );

    const [blockedUsers, blockedChats] = await Promise.all([
      Promise.all(blockedUsersPromises),
      Promise.all(blockedChatsPromises),
    ]);
    return res.status(200).json({
      email: user.email,
      username: user.username,
      blockedUsers: blockedUsers,
      blockedChats: blockedChats,
    });
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("contacts");
    const contactsPromises = Array.from(user.contacts.keys()).map((userId) =>
      User.findById(userId).select("username _id")
    );
    const contacts = Promise.all(contactsPromises);
    return res.status(200).json({
      contacts: contacts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRequests = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("requests");
    const requestsPromises = Array.from(user.requests.keys()).map((reqId) =>
      Request.findById(reqId)
    );
    const requests = Promise.all(requestsPromises);
    return res.status(200).json({
      requests: requests,
    });
  } catch (error) {
    next(error);
  }
};

exports.getChats = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("chats");
    const chatsPromises = Array.from(user.chats.keys()).map((chatId) =>
      Chat.findById(chatId).select("name _id")
    );

    const chats = await Promise.all(chatsPromises);
    return res.status(200).json({
      chats: chats,
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

exports.changeUsername = async (req, res, next) => {
  try {
    const { new_username } = req.body;
    req.user.username = new_username;
    await req.user.save();
    return res.status(201).json({ message: "username changed successfully" });
  } catch (error) {
    next(error);
  }
};
