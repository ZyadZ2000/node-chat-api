import * as userHandlers from "../../controllers/socket.io/user.js";

export default (io, socket) => {
  socket.on("user:block", async (data, callback) => {
    try {
      await userHandlers.user_blockHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });

  socket.on("user:deleteContact", async (data, callback) => {
    try {
      await userHandlers.user_deleteContactHandler(io, socket, data, callback);
    } catch (error) {
      return callback({ success: false, error });
    }
  });
};
