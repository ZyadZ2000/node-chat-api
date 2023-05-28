const User = require("../../models/user");
const Request = require("../../models/request");
const JoiSchemas = require("../../joi-schemas");

exports.user_blockHandler = async (io, socket, data, callback) => {
  try {
    let alreadyBlocked = false;

    const userId = data.userId;

    if (!userId) throw new Error("User ID must be provided");

    const { error } = JoiSchemas.mongoIdSchema.validate(userId);

    if (error) {
      throw new Error("Invalid User ID");
    }

    Request.init();

    const currentUser = await User.findById(socket.userId).populate("requests");

    const blockedUser = await User.findById(userId).populate("requests");

    if (!blockedUser || !currentUser) throw new Error("User(s) doesn't exist");

    alreadyBlocked = currentUser.blockedUsers.find((user) => {
      return user == blockedUser.id;
    });

    if (alreadyBlocked) return callback({ success: true });
    //add the blocked user to the blocked list
    currentUser.blockedUsers.push(blockedUser.id);

    let requestId = null;
    //remove this blocked user from the current user requests
    currentUser.requests = currentUser.requests.filter((request) => {
      if (!(request.from == blockedUser.id)) return true;
      requestId = request.id;
      return false;
    });

    blockedUser.requests = blockedUser.requests.filter(
      (request) => !(request.to == currentUser.id)
    );

    currentUser.contacts = currentUser.contacts.filter((contact) => {
      return !(contact == blockedUser.id);
    });

    //remove this user from the blocked user contacts
    blockedUser.contacts = blockedUser.contacts.filter(
      (contact) => !(contact == currentUser.id)
    );

    if (requestId) await Request.findByIdAndDelete(requestId);
    await currentUser.save();
    await blockedUser.save();

    callback({ success: true });

    io.to(blockedUser.id).to(currentUser.id).emit("user:block", {
      by: currentUser.id,
      blocked: blockedUser.id,
    });
  } catch (error) {
    throw error;
  }
};

exports.user_deleteContactHandler = async (io, socket, data, callback) => {
  try {
    const userId = data.userId;

    if (!userId) throw new Error("User ID must be provided");

    const { error } = JoiSchemas.mongoIdSchema.validate(userId);

    if (error) {
      throw new Error("Invalid User ID");
    }

    const currentUser = await User.findById(socket.userId);

    const deletedContact = await User.findById(userId);

    console.log(currentUser);
    console.log(deletedContact);

    if (!deletedContact || !currentUser)
      throw new Error("User(s) doesn't exist");

    let isContact = false;

    currentUser.contacts = currentUser.contacts.filter((contact) => {
      if (contact == deletedContact.id) {
        isContact = true;
        return false;
      }
      return true;
    });

    if (!isContact) return callback({ success: true });

    deletedContact.contacts = deletedContact.contacts.filter(
      (contact) => !(contact == currentUser.id)
    );

    await currentUser.save();
    await deletedContact.save();

    callback({ success: true });

    io.to(deletedContact.id).to(currentUser.id).emit("user:deleteContact", {
      by: currentUser.id,
      deleted: deletedContact.id,
    });
  } catch (error) {
    throw error;
  }
};
