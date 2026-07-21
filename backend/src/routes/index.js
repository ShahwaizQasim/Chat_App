import { Router } from "express"
import { UserGet, UserLogin, UserSignUp } from "../controller/user.controller.js";
import { GetMessages, MarkMessagesAsRead, UploadVoice } from "../controller/Message.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import { VerifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.use("/auth/signUp",
    upload.single("profilePicture"),
    UserSignUp)

router.use("/auth/login", UserLogin)

router.get("/get/all_users", VerifyUser, UserGet)

router.get("/get/chat_message/:senderId/:recieverId", GetMessages)
router.put("/messages/read/:senderId", VerifyUser, MarkMessagesAsRead);
router.post("/upload-voice", upload.single("voice"), UploadVoice)

export default router;