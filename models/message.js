const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
    receivers: {
      type: [
        {
          type: String,
          ref: "User",
        },
      ],
      validate: {
        validator: function (arr) {
          return arr.length >= 1;
        },
        message: "At least one receiver is required.",
      },
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
