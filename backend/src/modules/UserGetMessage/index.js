import { Router } from "express";
import { GetMessages } from "./controller/MessageGet.js";

const GetMessageRoutes = Router();
GetMessageRoutes.get("/chat_message/:senderId/:recieverId", GetMessages)

export default GetMessageRoutes;
