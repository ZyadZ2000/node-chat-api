const Chat = require("../../models/chat");
const User = require("../../models/user");
const Message = require("../../models/message");

const dataValidation = require("../../helper/socket-data-validation");

const mongoose = require("mongoose");

exports.chat_createHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    dataValidation(data);

    const chatName = data.chatName;

    if (!chatName) throw new Error("Chat name not provided");

    const creator = await User.findById(socket.userId).session(session);

    let chat = new Chat({
      name: chatName,
      creator: creator.id,
      members: new Map([creator.id, true]),
    });

    chat = await chat.save({ session });

    creator.chats.set(chat.id, true);

    await creator.save({ session });

    await session.commitTransaction();
    session.endSession();

    socket.join(chat.id);
    callback({ success: true, chat });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.chat_joinHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    dataValidation(data);

    const chatId = data.chatId;

    if (!chatId) throw new Error("Chat ID not provided");

    const user = await User.findById(socket.userId).session(session);

    const chat = await Chat.findById(chatId).session(session);

    if (!chat) throw new Error("Chat doesn't exist");

    let isChatBlocked = false;
    let isChatMember = false;

    isChatBlocked = user.blockedChats.has(chat.id);

    if (isChatBlocked) throw new Error("Chat is blocked by this user");

    isChatMember = chat.members.has(user.id);

    if (isChatMember) return callback({ success: true });

    chat.members.set(user.id, true);
    user.chats.set(chat.id, true);

    await chat.save({ session });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    socket.join(chat.id);
    callback({ success: true, chat });
    io.to(chat.id).emit("chat:join", {
      by: user.username,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.chat_enterHandler = async (io, socket, data, callback) => {
  try {
    dataValidation(data);

    const chatId = data.chatId;
    const userId = socket.userId;

    if (!chatId) throw new Error("Chat ID not provided");

    const chat = await Chat.findById(chatId);

    if (!chat) throw new Error("Chat doesn't exist");

    let isChatMember = false;

    isChatMember = chat.members.has(userId);

    if (!isChatMember) throw new Error("Not a chat member");

    callback({ success: true, chat });
  } catch (error) {
    throw error;
  }
};

exports.chat_sendMessageHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    dataValidation(data);

    const chatId = data.chatId;
    const messageContent = data.messageContent;

    if (!chatId || !messageContent)
      throw new Error("Chat ID or message content not provided");

    const sender = await User.findById(socket.userId).select("_id username");
    const chat = await Chat.findById(chatId).session(session);

    if (!chat) throw new Error("Chat room doesn't exist");

    let isChatMember = false;

    isChatMember = chat.members.has(sender.id);

    if (!isChatMember) throw new Error("User isn't a chat member");

    let message = new Message({
      sender: sender.id,
      messageContent: messageContent,
    });

    message = await message.save({ session });

    chat.messages.push(message.id);

    await chat.save({ session });

    await session.commitTransaction();
    session.endSession();

    callback({ success: true });
    io.to(chat.id).emit("chat:message", {
      sender: sender.username,
      messageContent: message.messageContent,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.chat_leaveHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    dataValidation(data);

    const chatId = data.chatId;

    if (!chatId) throw new Error("Chat ID not provided");

    const user = await User.findById(socket.userId).session(session);
    const chat = await Chat.findById(chatId).session(session);

    if (!chat) throw new Error("Chat room doesn't exist");

    let isChatMember = false;

    isChatMember = chat.members.has(user.id);

    if (!isChatMember) callback({ success: true });

    user.chats.delete(chat.id);
    chat.members.delete(user.id);

    await user.save({ session });
    await chat.save({ session });
    await session.commitTransaction();
    session.endSession();

    callback({ success: true });
    io.to(chat.id).emit("chat:leave", {
      by: user.username,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.chat_blockHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    dataValidation(data);

    const chatId = data.chatId;

    if (!chatId) throw new Error("Chat ID not provided");

    const user = await User.findById(socket.userId).session(session);
    const chat = await Chat.findById(chatId).session(session);

    if (!chat) throw new Error("Chat room doesn't exist");

    let isChatBlocked = false;

    isChatBlocked = user.blockedChats.has(chat.id);

    if (isChatBlocked) return callback({ success: true });

    user.blockedChats.set(chat.id, true);
    user.chats.delete(chat.id);
    chat.members.delete(user.id);

    await user.save({ session });
    await chat.save({ session });
    await session.commitTransaction();
    session.endSession();

    callback({ success: true });
    io.to(chat.id).emit("chat:block", {
      by: user.username,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.chat_removeMemberHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    dataValidation(data);

    const chatId = data.chatId;
    const memberId = data.userId;

    if (!chatId || !memberId)
      throw new Error("Chat ID or member ID not provided");

    const sender = await User.findById(socket.userId).select("_id username");
    const member = await User.findById(memberId).session(session);
    const chat = await Chat.findById(chatId).session(session);

    if (!chat) throw new Error("Chat room doesn't exist");

    let isCreator = chat.creator == sender.id;

    if (!isCreator) throw new Error("Not authorized");

    let isChatMember = chat.members.has(member.id);

    if (!isChatMember) return callback({ success: true });

    member.chats.delete(chat.id);
    chat.members.delete(member.id);

    await member.save({ session });
    await chat.save({ session });
    await session.commitTransaction();
    session.endSession();

    callback({ success: true });
    io.to(chat.id).emit("chat:remove", {
      by: sender.username,
      removed: member.username,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
