const userHandlers = require("../../controllers/socket.io/user");

module.exports = (io, socket) => {
  socket.on("user:block", async (data) => {
    try {
      await userHandlers.user_blockHandler(io, socket, data);
    } catch (error) {
      return next(error);
    }
  });

  socket.on("user:deleteContact", async (data) => {
    try {
      await userHandlers.user_deleteContactHandler(io, socket, data);
    } catch (error) {
      return next(error);
    }
  });
};
