const Chat = require("../../models/chat");
const User = require("../../models/user");
const JoiSchemas = require("../../joi-schemas");

const mongoose = require("mongoose");

exports.chat_createHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const chatName = data.chatName;

    if (!chatName) throw new Error("Chat name not provided");

    const { error } = JoiSchemas.chatNameSchema.validate(chatName);
    if (error) {
      throw new Error("Invalid chat name");
    }

    const user = await User.findById(socket.userId).session(session);

    let chat = new Chat({
      name: chatName,
      creator: user.id,
      members: [user.id],
    });

    chat = await chat.save({ session });

    user.chats.push(chat.id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    socket.join(chat.id);
    callback({ success: true, chatId: chat.id });
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
    const chatId = data.chatId;

    if (!chatId) throw new Error("Chat ID not provided");

    const { error } = JoiSchemas.mongoIdSchema.validate(chatName);
    if (error) {
      throw new Error("Invalid chat ID");
    }

    const user = await User.findById(socket.userId).session(session);

    const chat = await Chat.findById(chatId);

    if (!chat) throw new Error("Chat doesn't exist");

    let isChatBlocked = false;
    let isChatMember = false;
    let isIncludedInUser = false;

    isChatBlocked = user.blockedChats.find((cId) => cId == chat.id);

    if (isChatBlocked) throw new Error("Chat is blocked by this user");

    isChatMember = chat.members.find((uId) => uId == user.id);

    isIncludedInUser = user.chats.find((cId) => cId == chat.id);

    if (!isChatMember) {
      chat.members.push(user.id);

      await chat.save({ session });
    }
    if (!isIncludedInUser) {
      user.chats.push(chat.id);

      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();

    socket.join(chat.id);
    callback({ success: true });
    io.to(user.id).emit("chat:data", {
      id: chat.id,
      name: chat.name,
      messages: chat.messages,
      members: chat.members,
      creator: chat.creator,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.chat_enterHandler = async (io, socket, data, callback) => {
  try {
    const chatId = data.chatId;

    if (!chatId) throw new Error("Chat ID not provided");

    const { error } = JoiSchemas.mongoIdSchema.validate(chatName);
    if (error) {
      throw new Error("Invalid chat ID");
    }

    const user = await User.findById(socket.userId).session(session);

    const chat = await Chat.findById(chatId);

    if (!chat) throw new Error("Chat doesn't exist");

    let isChatBlocked = false;
    let isChatMember = false;
    let isIncludedInUser = false;

    isChatBlocked = user.blockedChats.find((cId) => cId == chat.id);

    if (isChatBlocked) throw new Error("Chat is blocked by this user");

    isChatMember = chat.members.find((uId) => uId == user.id);

    if (!isChatMember) throw new Error("Not a chat member");

    isIncludedInUser = user.chats.find((cId) => cId == chat.id);

    if (!isIncludedInUser) throw new Error("Not a chat member");

    callback({ success: true });
    io.to(user.id).emit("chat:data", {
      id: chat.id,
      name: chat.name,
      messages: chat.messages,
      members: chat.members,
      creator: chat.creator,
    });
  } catch (error) {
    throw error;
  }
};
