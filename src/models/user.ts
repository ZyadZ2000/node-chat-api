import mongoose from "mongoose";

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
    of: Boolean,
    default: new Map(),
  },

  chats: {
    type: Map,
    of: Boolean, //{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    default: new Map(),
  },

  blockedUsers: {
    type: Map,
    of: Boolean,
    default: new Map(),
  },

  blockedChats: {
    type: Map,
    of: Boolean,
    default: new Map(),
  },

  requests: {
    type: Map,
    of: Boolean,
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

export default User;
