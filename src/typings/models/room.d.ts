import mongoose, { Document } from "mongoose";

type Validate<T> = {
  validator: (members: T) => boolean;
  message: string;
};

type Member = {
  type: Map<mongoose.Schema.Types.ObjectId, number>;
  validate: Validate<Map<mongoose.Schema.Types.ObjectId, number>>;
};

type Admin = {
  type: mongoose.Schema.Types.ObjectId[];
  validate: Validate<mongoose.Schema.Types.ObjectId[]>;
};

interface IRoom extends Document {
  name: string;
  photo: string | null;
  members: Member; // Map<string, number>;
  messages: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  admins: Admin;
}

export default IRoom;
