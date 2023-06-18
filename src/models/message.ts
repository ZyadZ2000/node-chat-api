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
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Room",
  messageSchema
);

export default Message;
