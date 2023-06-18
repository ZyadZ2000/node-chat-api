import mongoose, { Schema, Document, Model } from "mongoose";
import type IRequest from "../typings/models/request.d.ts";

const requestSchema: Schema<IRequest> = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["group", "private", "contact"],
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Request: Model<IRequest> = mongoose.model<IRequest>(
  "Request",
  requestSchema
);

export default Request;
