const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const chatSchema = new mongoose.Schema({
  members: [
    {
      type: String,
      ref: "User",
      validate: {
        validator: function (arr) {
          return arr.length >= 2;
        },
        message: "At least one receiver is required.",
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
  inviteId: {
    type: String,
    required: true,
    default: uuidv4,
  },
});
