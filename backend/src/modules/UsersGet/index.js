import { Router } from "express";
import UserGet from "./controller/user.get.js";

const UserGetRoutes = Router();
UserGetRoutes.get("/all_users", UserGet)

export default UserGetRoutes;
