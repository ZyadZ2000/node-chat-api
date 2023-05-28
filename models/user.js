const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  contacts: [
    /* References another user */
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  chats: [
    /* References a chat */
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: [],
    },
  ],
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  blockedChats: [
    /* References a chat */
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: [],
    },
  ],
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: [],
    },
  ],
  token: {
    type: String,
    default: null,
  },
  tokenExpiration: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
