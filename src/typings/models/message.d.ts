import mongoose, { Document } from "mongoose";

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  messageContent: string;
  createdAt: Date;
}

export default IMessage;
