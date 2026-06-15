import { messageModel } from "../models/userMessage.modal.js"

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

export {
  GetMessages
}
