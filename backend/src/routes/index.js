import { Router } from "express"
import UserRoutes from "../modules/users/index.js";

const router = Router();

router.use("/auth", UserRoutes)

export default router;