import mongoose, { Schema, Model } from "mongoose";
import type IMessage from "../typings/models/message.d.ts";

const messageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageContent: {
      type: String, // Could be path to media file
      required: true,
    },
    media: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Room",
  messageSchema
);

export default Message;
