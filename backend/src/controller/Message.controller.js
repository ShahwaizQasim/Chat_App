import { messageModel } from "../models/userMessage.modal.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const GetMessages = async (req, res) => {
  try {
    const { senderId, recieverId } = req.params;
    const messages = await messageModel
      .find({
        $or: [  // $or mongodb query operator
          // $or MongoDB ka ek logical operator hai jo kehta hai:
          // "Mujhe woh saare documents do jisme inme se koi ek condition true ho"
          { senderId, recieverId },
          { senderId: recieverId, recieverId: senderId },
        ],
      })
      .sort({ createdAt: 1 });
    res.json({ success: true, msg: messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, error: error?.message });
  }
};

const MarkMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;

    await messageModel.updateMany(
      {
        senderId,
        recieverId: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).send({
      status: 200,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const UploadVoice = async (req, res) => {
  try {
    let voiceFilePath = req.file.path;

    if (!voiceFilePath) {
      return res.status(400).send({
        status: 400,
        message: "No voice file uploaded",
      });
    }

    let voiceFile = await uploadOnCloudinary(voiceFilePath);
    res.status(200).send({
      status: 200,
      message: "Voice message uploaded successfully",
      voiceUrl: voiceFile.url
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
    console.log("voice api error", error);
  }
}

const UploadFile = async (req, res) => {
  try {
    let UserFilePath = req.file.path;

    if (!UserFilePath) {
      return res.status(400).send({
        status: 400,
        message: "No voice file uploaded",
      });
    }
    let FilePath = await uploadOnCloudinary(UserFilePath);
    res.status(200).send({
      status: 200,
      message: "File uploaded successfully",
      fileUrl: FilePath.url
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
    console.log("voice api error", error);
  }
}

export {
  GetMessages,
  MarkMessagesAsRead,
  UploadVoice,
  UploadFile
}
