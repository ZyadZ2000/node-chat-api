import { v4 as uuidv4 } from "uuid";

import User from "../../models/user.js";
import Chat from "../../models/chat.js";
import * as JoiSchemas from "../../joi-schemas.js";

export const request_sendHandler = async (io, socket, data, callback) => {
  try {
    const request = data.request;

    if (!request) throw new Error("Request must be provided");

    const errorMessage = "";
    const { error: usernameError } = JoiSchemas.usernameSchema.validate(
      request.to
    );
    const { error: requestTypeError } = JoiSchemas.requestSchema.validate(
      request.type
    );

    if (usernameError)
      errorMessage +=
        "Username must be a string, minimum of 3 characters and maximum of 30.\n";

    if (requestTypeError)
      errorMessage +=
        'Request type should be one of the following: "group chat request", "private chat request", "contact request"';

    if (errorMessage) throw new Error(errorMessage);

    if (
      request.type === "group chat request" ||
      request.type === "private chat request"
    ) {
      if (!request.chatId)
        throw new Error("chat ID must be provided in the request");
      const { error: chatIdError } = JoiSchemas.chatIdSchema.validate(
        request.chatId
      );
      if (chatIdError) throw new Error("Invalid chat ID");
    }

    const sender = await User.findById(socket.userId);
    const receiver = await User.findOne({ username: request.to });

    if (!sender || !receiver) throw new Error("User(s) doesn't exist");

    let requested_chat = null;
    let isSenderBlocked = false;
    isSenderBlocked = receiver.blockedUsers.find(
      (username) => username === sender.username
    );
    if (isSenderBlocked)
      throw new Error("Coudln't send request due to being blocked");
    if (
      request.type === "group chat request" ||
      request.type === "private chat request"
    ) {
      let isSenderInChat = false;
      let isChatBlocked = false;
      //   let isReceiverAlreadyInChat = false;

      isSenderInChat = sender.chats.find((chat) => chat === request.chatId);

      if (!isSenderInChat) throw new Error("Sender must be in the chat first");

      isChatBlocked = receiver.blockedChats.find(
        (chat) => chat === request.chatId
      );

      if (isChatBlocked) throw new Error("Receiver has blocked this chat");

      //   isReceiverAlreadyInChat = receiver.chats.find(
      //     (chat) => chat === request.chatId
      //   );

      //   if (isReceiverAlreadyInChat) return callback({ success: true });

      requested_chat = await Chat.exists({ id: request.chatId });

      if (!requested_chat) throw new Error("Chat room doesn't exist");

      const requestId = uuidv4();

      receiver.requests.push({
        id: requestId,
        from: sender.username,
        type: request.type,
        chatId: request.chatId,
      });

      await receiver.save();

      callback({ success: true });
      io.to(socket.userId)
        .to(receiver.id)
        .emit("request:send", {
          by: sender.username,
          request: {
            id: requestId,
            ...request,
          },
        });
    } else {
      const requestId = uuidv4();
      receiver.requests.push({
        id: requestId,
        from: sender.username,
        type: request.type,
      });

      await receiver.save();
      callback({ success: true });
      io.to(socket.userId)
        .to(receiver.id)
        .emit("request:send", {
          by: sender.username,
          request: {
            id: requestId,
            to: request.to,
            type: request.type,
          },
        });
    }
  } catch (error) {
    throw error;
  }
};

export const request_acceptHandler = async (io, socket, data, callback) => {
  try {
    const request = data.request;

    if (!request) throw new Error("Request must be provided");

    const errorMessage = "";
    const { error: usernameError } = JoiSchemas.usernameSchema.validate(
      request.to
    );
    const { error: requestTypeError } = JoiSchemas.requestSchema.validate(
      request.type
    );

    if (usernameError)
      errorMessage +=
        "Username must be a string, minimum of 3 characters and maximum of 30.\n";

    if (requestTypeError)
      errorMessage +=
        'Request type should be one of the following: "group chat request", "private chat request", "contact request"';

    if (errorMessage) throw new Error(errorMessage);

    if (
      request.type === "group chat request" ||
      request.type === "private chat request"
    ) {
      if (!request.chatId)
        throw new Error("chat ID must be provided in the request");
      const { error: chatIdError } = JoiSchemas.chatIdSchema.validate(
        request.chatId
      );
      if (chatIdError) throw new Error("Invalid chat ID");
    }

    const sender = await User.findById(socket.userId);
    const receiver = await User.findOne({ username: request.to });

    if (!sender || !receiver) throw new Error("User(s) doesn't exist");

    let requested_chat = null;
    let isSenderBlocked = false;
    isSenderBlocked = receiver.blockedUsers.find(
      (username) => username === sender.username
    );
    if (isSenderBlocked)
      throw new Error("Coudln't send request due to being blocked");
    if (
      request.type === "group chat request" ||
      request.type === "private chat request"
    ) {
      let isSenderInChat = false;
      let isChatBlocked = false;
      //   let isReceiverAlreadyInChat = false;

      isSenderInChat = sender.chats.find((chat) => chat === request.chatId);

      if (!isSenderInChat) throw new Error("Sender must be in the chat first");

      isChatBlocked = receiver.blockedChats.find(
        (chat) => chat === request.chatId
      );

      if (isChatBlocked) throw new Error("Receiver has blocked this chat");

      //   isReceiverAlreadyInChat = receiver.chats.find(
      //     (chat) => chat === request.chatId
      //   );

      //   if (isReceiverAlreadyInChat) return callback({ success: true });

      requested_chat = await Chat.exists({ id: request.chatId });

      if (!requested_chat) throw new Error("Chat room doesn't exist");

      const requestId = uuidv4();

      receiver.requests.push({
        id: requestId,
        from: sender.username,
        type: request.type,
        chatId: request.chatId,
      });

      await receiver.save();

      callback({ success: true });
      io.to(socket.userId)
        .to(receiver.id)
        .emit("request:send", {
          by: sender.username,
          request: {
            id: requestId,
            ...request,
          },
        });
    } else {
      const requestId = uuidv4();
      receiver.requests.push({
        id: requestId,
        from: sender.username,
        type: request.type,
      });

      await receiver.save();
      callback({ success: true });
      io.to(socket.userId)
        .to(receiver.id)
        .emit("request:send", {
          by: sender.username,
          request: {
            id: requestId,
            to: request.to,
            type: request.type,
          },
        });
    }
  } catch (error) {
    throw error;
  }
};

export const request_deleteHandler = async (io, socket, data, callback) => {
  try {
    if (!data.username || !data.request)
      throw new Error("Username and request must be provided");

    const errorMessage = "";
    const { usernameError } = JoiSchemas.usernameSchema.validate(data.username);
    const { requestError } = JoiSchemas.requestSchema.validate(data.request);
    if (usernameError)
      errorMessage +=
        "Username must be a string, minimum of 3 characters and maximum of 30.\n";

    if (requestError)
      errorMessage +=
        'Request should be one of the following: "group chat request", "private chat request", "contact request"';

    if (errorMessage) throw new Error(errorMessage);

    const username = data.username;
    const request = data.request;
  } catch (error) {
    throw error;
  }
};
