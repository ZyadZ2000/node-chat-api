// const express = require("express");
// const { body } = require("express-validator");
// const passport = require("passport");

// const chatController = require("../../controllers/socket.io/chat");
// const { validate, sanitize } = require("../../middleware/validate-sanitize");
// const User = require("../../models/user");

// const router = express.Router();

// /**************** */
// router.get("/chat/messages");

// router.get("/chat/members");

// router.post("/chat/create");

// /******************* */

// //!!!!!! SOCKET.IO!!!!!!!
// router.post("/chat/block");
// router.post("/chat/messages/send");

// router.post("/chat/join");

// router.put("/chat/members/remove");

// router.delete("/chat");

// module.exports = router;
const chatHandlers = require("../../controllers/socket.io/chat");

module.exports = (io, socket) => {
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
};
