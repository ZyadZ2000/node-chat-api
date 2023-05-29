const User = require("../../models/user");
const Request = require("../../models/request");

const dataValidation = require("../../helper/socket-data-validation");
const { default: mongoose } = require("mongoose");

exports.user_blockHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    dataValidation(data);

    let alreadyBlocked = false;

    const userId = data.userId;

    if (!userId) throw new Error("User ID must be provided");

    const currentUser = await User.findById(socket.userId).session(session);

    const blockedUser = await User.findById(userId).session(session);

    if (!blockedUser || !currentUser) throw new Error("User(s) doesn't exist");

    alreadyBlocked = currentUser.blockedUsers.has(blockedUser.id);

    console.log(alreadyBlocked);

    if (alreadyBlocked) return callback({ success: true });
    //add the blocked user to the blocked list
    currentUser.blockedUsers.set(blockedUser.id, true);

    console.log(currentUser);

    const requests = await Request.find({
      $or: [
        { $and: [{ to: currentUser.id }, { from: blockedUser.id }] },
        { $and: [{ to: blockedUser.id }, { from: currentUser.id }] },
      ],
    }).session(session);

    for (const request of requests) {
      currentUser.requests.delete(request.id);
      blockedUser.requests.delete(request.id);
      await Request.deleteOne({ _id: request.id }).session(session);
    }

    currentUser.contacts.delete(blockedUser.id);

    //remove this user from the blocked user contacts
    blockedUser.contacts.delete(currentUser.id);

    await currentUser.save({ session });
    await blockedUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    callback({ success: true });

    io.to(blockedUser.id).to(currentUser.id).emit("user:block", {
      by: currentUser.username,
      blocked: blockedUser.username,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    throw error;
  }
};

exports.user_deleteContactHandler = async (io, socket, data, callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    dataValidation(data);

    const userId = data.userId;

    if (!userId) throw new Error("User ID must be provided");

    const currentUser = await User.findById(socket.userId).session(session);

    const deletedContact = await User.findById(userId).session(session);

    if (!deletedContact || !currentUser)
      throw new Error("User(s) doesn't exist");

    let isContact = currentUser.contacts.has(deletedContact.id);

    if (!isContact) return callback({ success: true });

    currentUser.contacts.delete(deletedContact.id);
    deletedContact.contacts.delete(currentUser.id);

    await currentUser.save({ session });
    await deletedContact.save({ session });

    await session.commitTransaction();
    session.endSession();

    callback({ success: true });

    io.to(deletedContact.id).to(currentUser.id).emit("user:deleteContact", {
      by: currentUser.username,
      deleted: deletedContact.username,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
