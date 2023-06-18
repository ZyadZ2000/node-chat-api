import mongoose, { Document } from "mongoose";

interface IRequest extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  type: "group" | "private" | "contact";
  chat: mongoose.Types.ObjectId | null;
}

export default IRequest;
