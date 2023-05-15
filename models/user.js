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
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "Group",
    },
  ],
  blockedList: [
    {
      type: String,
      default: [],
      ref: "User",
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
        group: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
          default: null,
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
