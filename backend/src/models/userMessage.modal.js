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
  },
  image: {
    type: String,
    default: ""
  },
  voice: {
    type: String,
    default: ""
  },
  messageType: {
    type: String,
    enum: ["text", "image", "voice"],
    required: true
  },
  time: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
},
  { timestamps: true }
);

export const messageModel =
  mongoose.models.message || mongoose.model("Message", MessageSchema);
