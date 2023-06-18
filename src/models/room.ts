import mongoose, { Schema, Model, mongo } from "mongoose";
import type IRoom from "../typings/models/room.d.ts";

const roomSchema: Schema<IRoom> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: null,
  },
  members: {
    type: Map,
    of: Number,
    validate: {
      validator: function (
        members: Map<mongoose.Schema.Types.ObjectId, number>
      ): boolean {
        return members.size > 0;
      },
      message: 'The "members" field must have at least one entry.',
    },
    default: function (this: any): Map<mongoose.Schema.Types.ObjectId, number> {
      const defaultMap = new Map<mongoose.Schema.Types.ObjectId, number>();
      defaultMap.set(this.creator, 0);
      return defaultMap;
    },
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: [],
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function (
          admins: mongoose.Schema.Types.ObjectId[]
        ): boolean {
          return admins.length > 0;
        },
        message: 'The "members" field must have at least one entry.',
      },
      default: function (this: IRoom): mongoose.Types.ObjectId[] {
        return [this.creator];
      },
    },
  ],
});

const Room: Model<IRoom> = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
