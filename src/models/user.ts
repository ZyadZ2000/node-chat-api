import mongoose, { Schema, Document, Model } from "mongoose";
import type IUser from "../typings/models/user.js";

const userSchema: Schema<IUser> = new mongoose.Schema({
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
  photo: {
    type: String,
    default: null,
  },
  contacts: {
    type: Map,
    of: null,
    default: new Map<mongoose.Schema.Types.ObjectId, null>(),
  },
  rooms: {
    type: Map,
    of: null,
    default: new Map<mongoose.Schema.Types.ObjectId, null>(),
  },
  blockedUsers: {
    type: Map,
    of: null,
    default: new Map<mongoose.Schema.Types.ObjectId, null>(),
  },
  blockedChats: {
    type: Map,
    of: null,
    default: new Map<mongoose.Schema.Types.ObjectId, null>(),
  },
  requests: {
    type: Map,
    of: null,
    default: new Map<mongoose.Schema.Types.ObjectId, null>(),
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
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

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
