import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  photo: string | null;
  contacts: Map<mongoose.Schema.Types.ObjectId, null>;
  rooms: Map<mongoose.Schema.Types.ObjectId, null>;
  blockedUsers: Map<mongoose.Schema.Types.ObjectId, null>;
  blockedChats: Map<mongoose.Schema.Types.ObjectId, null>;
  requests: Map<mongoose.Schema.Types.ObjectId, null>;
  status: "online" | "offline";
  token: string | null;
  tokenExpiration: Date | null;
}

export default IUser;
