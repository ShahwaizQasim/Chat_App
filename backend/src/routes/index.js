import { Router } from "express"
import UserAuthRoutes from "../modules/users/index.js";
import UserGetRoutes from "../modules/UsersGet/index.js";
import GetMessageRoutes from "../modules/UserGetMessage/index.js";

const router = Router();

router.use("/auth", UserAuthRoutes)
router.use("/get", UserGetRoutes)
router.use("/get", GetMessageRoutes)

export default router;