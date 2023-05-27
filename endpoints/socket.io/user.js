// const express = require("express");
// const { body } = require("express-validator");
// const passport = require("passport");

const User = require("../../models/user");
//let {io} = require("../../io_instance");
// const userController = require("../controllers/user");
// const { validate } = require("../middleware/validate-sanitize");
// const User = require("../models/user");

// const router = express.Router();

// /* SOCKET.IO */
// router.post(
//   "/block",
//   [
//     body("username")
//       .isString()
//       .withMessage("username must be a string.")
//       .isLength({ min: 3, max: 30 })
//       .withMessage("username must be at least 3 characters.")
//       .custom(async (value) => {
//         const user = await User.findOne({ username: value });
//         if (!user) {
//           return Promise.reject("username doesn't exist");
//         }
//       }),
//   ],
//   passport.authenticate("jwt", { session: false }),
//   userController.blockUser
// );

// router.delete(
//   "/contact/delete",
//   [
//     body("username")
//       .isString()
//       .withMessage("username must be a string.")
//       .isLength({ min: 3, max: 30 })
//       .withMessage("username must be at least 3 characters.")
//       .custom(async (value) => {
//         const user = await User.findOne({ username: value });
//         if (!user) {
//           return Promise.reject("username doesn't exist");
//         }
//       }),
//   ],
//   passport.authenticate("jwt", { session: false }),
//   userController.deleteUser
// );

// module.exports = router;

blockEvent = (socket) => {
  return socket.on("blockUser", async (data) => {
    try {
      const { blockedUsername } = data;

      const currentUser = socket.user;

      const blockedUser = await User.findOne({ username: blockedUsername });

      if (!blockedUser) return next(new Error("Username doesn't exist"));

      //add the blocked user to the blocked list
      currentUser.blockedUsers.push(blockedUsername);

      //remove this blocked user from the current user requests
      currentUser.requests = currentUser.requests.filter(
        (request) => request.from !== blockedUsername
      );

      //remove this user from the blocked user contacts
      blockedUser.contacts = blockedUser.contacts.filter(
        (contact) => contact !== currentUser.username
      );

      await currentUser.save();
      await blockedUser.save();
    } catch (error) {
      //emit the error here
    }
  });
};

deleteEvent = (socket) => {
  return socket.on("deleteContact", async (data) => {
    try {
      const { blocked_username } = data;

      const current_user = socket.user;

      const blocked_user = await User.findOne({ username: blocked_username });

      if (!blocked_user) return next(new Error("Username doesn't exist"));

      //add the blocked user to the blocked list
      current_user.blockedUsers.push(blocked_username);

      //remove this user from the blocked user contacts
      blocked_user.contacts = blocked_user.contacts.filter(
        (contact) => contact !== current_user.username
      );
      //remove this blocked user from the current user requests
      current_user.requests = current_user.requests.filter();
    } catch (error) {}
  });
};

module.exports = (socket) => {
  // socket.on("user:block");
  // socket.on("user:delete");
  socket.on("hello", (data) => {
    console.log("received");
    socket.to(socket.userId).emit("message", "hello from server");
  });
};
