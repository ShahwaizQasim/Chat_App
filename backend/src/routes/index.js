import { Router } from "express"
import UserAuthRoutes from "../modules/users/index.js";
import UserGetRoutes from "../modules/UsersGet/index.js";

const router = Router();

router.use("/auth", UserAuthRoutes)
router.use("/get", UserGetRoutes)

export default router;