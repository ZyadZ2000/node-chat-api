const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
    messageContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.Model("Message", messageSchema);

module.exports = Message;
