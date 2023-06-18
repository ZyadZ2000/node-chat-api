const requestHandlers = require("../../controllers/socket.io/requset");

module.exports = (io, socket) => {
  socket.on("request:send", async (data, callback) => {
    try {
      await requestHandlers.request_sendHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
  socket.on("request:accept", async (data, callback) => {
    try {
      await requestHandlers.request_acceptHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
  socket.on("request:delete", async (data, callback) => {
    try {
      await requestHandlers.request_deleteHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
};
