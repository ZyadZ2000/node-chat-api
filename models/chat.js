const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    /* References users */
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function (arr) {
          return arr.length >= 1;
        },
        message: "At least one member is required.",
      },
      required: true,
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: [],
    },
  ],
  creator: {
    /* References a user */
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Chat = mongoose.Model("Chat", chatSchema);

module.exports = Chat;
