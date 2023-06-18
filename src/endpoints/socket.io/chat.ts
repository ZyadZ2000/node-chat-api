import * as chatHandlers from "../../controllers/socket.io/chat.js";

export default (io, socket) => {
  socket.on("chat:create", async (data, callback) => {
    try {
      await chatHandlers.chat_createHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
  socket.on("chat:join", async (data, callback) => {
    try {
      await chatHandlers.chat_joinHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
  socket.on("chat:enter", async (data, callback) => {
    try {
      await chatHandlers.chat_enterHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
  socket.on("chat:sendMessage", async (data, callback) => {
    try {
      await chatHandlers.chat_sendMessageHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
  socket.on("chat:leave", async (data, callback) => {
    try {
      await chatHandlers.chat_leaveHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
  socket.on("chat:block", async (data, callback) => {
    try {
      await chatHandlers.chat_blockHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });

  socket.on("chat:removeMember", async (data, callback) => {
    try {
      await chatHandlers.chat_removeMemberHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });

  /* You could implement chat:delete */
};
