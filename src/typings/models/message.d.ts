import mongoose, { Document } from "mongoose";

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  messageContent: string;
  media: boolean;
  createdAt: Date;
}

export default IMessage;
