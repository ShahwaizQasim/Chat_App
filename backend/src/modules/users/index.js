import { Router } from "express";
import { UserLogin } from "./controllers/user.login.js";
import { UserSignUp } from "./controllers/user.signUp.js";

const UserRoutes = Router();

UserRoutes.use("/login", UserLogin);
UserRoutes.post("/signUp", UserSignUp);

export default UserRoutes;
