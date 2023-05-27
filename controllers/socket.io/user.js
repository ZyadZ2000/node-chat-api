const User = require("../../models/user");

exports.user_blockHandler = async (io, socket, data) => {
  try {
    let alreadyBlocked = false;

    const username = data.username;

    const currentUser = await User.findById(socket.userId);

    const blockedUser = await User.findOne({ username: username });

    if (!(blockedUser && currentUser)) throw new Error("User(s) doesn't exist");

    alreadyBlocked = currentUser.blockedUsers.find((user) => {
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

exports.user_deleteContactHandler = async (io, socket, data) => {
  try {
    let isContact = false;

    const username = data.username;

    const currentUser = await User.findById(socket.userId);

    const deletedContact = await User.findOne({ username: username });

    if (!(deletedContact && currentUser))
      throw new Error("User(s) doesn't exist");

    isContact = currentUser.contacts.find((contact) => {
      return contact === username;
    });

    if (!isContact) return;

    currentUser.contacts = currentUser.contacts.filter(
      (contact) => contact !== username
    );

    //remove this user from the blocked user contacts
    blockedUser.contacts = blockedUser.contacts.filter(
      (contact) => contact !== currentUser.username
    );

    await currentUser.save();
    await blockedUser.save();

    io.to(blockedUser.id).to(socket.userId).emit("user:deleteContact", {
      by: currentUser.username,
      deleted: blockedUser.username,
    });
  } catch (error) {
    throw error;
  }
};
