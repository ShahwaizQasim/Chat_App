import { Router } from "express";
import { UserLogin } from "./controllers/user.login.js";
import { UserSignUp } from "./controllers/user.signUp.js";

const UserAuthRoutes = Router();

UserAuthRoutes.use("/login", UserLogin);
UserAuthRoutes.post("/signUp", UserSignUp);

export default UserAuthRoutes;
