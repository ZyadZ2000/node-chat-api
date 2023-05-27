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

// user_deleteContactHandler = async (data) => {
//   return socket.on("deleteContact", async (data) => {
//     try {
//       const { blocked_username } = data;

//       const current_user = socket.user;

//       const blocked_user = await User.findOne({ username: blocked_username });

//       if (!blocked_user) return next(new Error("Username doesn't exist"));

//       //add the blocked user to the blocked list
//       current_user.blockedUsers.push(blocked_username);

//       //remove this user from the blocked user contacts
//       blocked_user.contacts = blocked_user.contacts.filter(
//         (contact) => contact !== current_user.username
//       );
//       //remove this blocked user from the current user requests
//       current_user.requests = current_user.requests.filter();
//     } catch (error) {}
//   });
// };

const user_blockHandler = async (io, socket, data) => {
  try {
    const username = data.username;

    const currentUser = await User.findById(socket.userId);

    const blockedUser = await User.findOne({ username: username });

    if (!(blockedUser && currentUser)) throw new Error("User(s) doesn't exist");

    let alreadyBlocked = currentUser.blockedUsers.find((user) => {
      return user === username;
    });

    if (alreadyBlocked) return;
    //add the blocked user to the blocked list
    currentUser.blockedUsers.push(username);

    //remove this blocked user from the current user requests
    currentUser.requests = currentUser.requests.filter(
      (request) => request.from !== username
    );

    currentUser.contacts = currentUser.contacts.filter(
      (contact) => contact !== username
    );

    //remove this user from the blocked user contacts
    blockedUser.contacts = blockedUser.contacts.filter(
      (contact) => contact !== currentUser.username
    );

    await currentUser.save();
    await blockedUser.save();

    io.to(blockedUser.id).to(socket.userId).emit("user:block", {
      by: currentUser.username,
      blocked: blockedUser.username,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = (io, socket) => {
  socket.on("user:block", async (data) => {
    try {
      await user_blockHandler(io, socket, data);
    } catch (error) {
      return next(error);
    }
  });
  // socket.on("user:deleteContact");
  socket.on("hello", (data) => {
    io.to(socket.userId).emit("message", { message: "hello from server" });
  });
};
