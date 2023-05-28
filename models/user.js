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
  contacts: {
    type: Map,
    of: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    default: new Map(),
  },

  chats: {
    type: Map,
    of: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    default: new Map(),
  },

  blockedUsers: {
    type: Map,
    of: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    default: new Map(),
  },

  blockedChats: {
    type: Map,
    of: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    default: new Map(),
  },

  requests: {
    type: Map,
    of: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    default: new Map(),
  },
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
