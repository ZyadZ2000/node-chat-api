const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const groupSchema = new mongoose.Schema({
  members: {
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
      message: "Group must have at least 1 member",
    },
    required: true,
  },
  admins: {
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
      message: "Group must have at least 1 member",
    },
    required: true,
  },
  onlyAdminMessages: {
    type: Boolean,
    default: false,
  },
  inviteId: {
    type: String,
    unique: true,
    required: true,
    default: uuidv4,
  },
});

const Group = mongoose.Model("Group", groupSchema);

module.exports = Group;
