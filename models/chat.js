const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: String,
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
    type: String,
    ref: "User",
    required: true,
  },
  inviteId: {
    type: String,
    required: true,
    default: uuidv4,
  },
});

const Chat = mongoose.Model("Chat", chatSchema);

module.exports = Chat;
