const { boolean } = require("joi");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: Map,
    of: Boolean, //{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    required: true,
    default: new Map(),
  },
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

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
