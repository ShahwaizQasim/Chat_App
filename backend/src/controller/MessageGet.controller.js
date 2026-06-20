import { messageModel } from "../models/userMessage.modal.js"

const GetMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    // const messages = await messageModel
    //   .find({
    //     $or: [  // $or mongodb query operator
    //            // $or MongoDB ka ek logical operator hai jo kehta hai:
    //            // "Mujhe woh saare documents do jisme inme se koi ek condition true ho"
    //       { senderId, receiverId },
    //       { senderId: recieverId, receiverId: senderId },
    //     ],
    //   })
    // .sort({ createdAt: 1 });
    const messages = await messageModel.find();
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
        receiverId: req.user._id,
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

export {
  GetMessages,
  MarkMessagesAsRead
}
