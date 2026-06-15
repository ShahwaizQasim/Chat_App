import { Router } from "express"
import { UserGet, UserLogin, UserSignUp } from "../controller/user.controller.js";
import { GetMessages } from "../controller/MessageGet.controller.js";
import { upload } from "../middleware/multer.middleware.js"

const router = Router();

router.use("/auth/signUp",
    upload.single("profilePicture"),
    UserSignUp)

router.use("/auth/login", UserLogin)

router.get("/get/all_users", UserGet)
router.get("/get/chat_message/:senderId/:recieverId", GetMessages)
export default router;