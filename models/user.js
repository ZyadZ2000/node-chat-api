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
  /* Username is gonna be used to identify other users, create a username index to optimize the query */
  contacts: [
    {
      type: String,
      default: [],
      ref: "User",
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "Chat",
    },
  ],
  blockedUsers: [
    {
      type: String,
      default: [],
      ref: "User",
    },
  ],
  blockedChats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "Chat",
    },
  ],
  requests: [
    {
      type: {
        from: {
          type: String,
          ref: "User",
          required: true,
        },
        /* Request types: chat request (a group or a private chat), contact request, */
        requestType: {
          type: String,
          required: true,
        },
      },
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
