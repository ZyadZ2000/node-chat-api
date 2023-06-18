import mongoose, { Document } from "mongoose";

type IRoomMember = Map<mongoose.Schema.Types.ObjectId, number>;

type Validate = {
  validator: (members: IRoomMember) => boolean;
  message: string;
};

type Member = {
  type: Map<mongoose.Schema.Types.ObjectId, number>;
  validate: Validate;
};
interface IRoom extends Document {
  name: string;
  photo: string | null;
  members: Member; // Map<string, number>;
  messages: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  admins: mongoose.Types.ObjectId[];
}

export default IRoom;
