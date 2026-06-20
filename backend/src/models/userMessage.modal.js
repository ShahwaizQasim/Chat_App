import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
    isRead: {
    type: Boolean,
    default: false,
  },
});

export const messageModel =
  mongoose.models.message || mongoose.model("Message", MessageSchema);
