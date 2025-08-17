import UserModel from "../../../models/user.modal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../../constant/index.js";
import 'dotenv/config';


export const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                const token = jwt.sign(
                    { _id: user._id, email },
                    ENV.JWT_SECRET_KEY,
                    { expiresIn: "1d" }
                );

                return res.status(200).send({
                    status: 200,
                    msg: "Login successful",
                    user: user,
                    token: token,
                    error: false
                });
            } else {
                return res.status(400).send({
                    status: 400,
                    msg: "Invalid password",
                    error: true
                });
            }
        } else {
            return res.status(404).send({
                status: 404,
                msg: "User not found",
                error: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: 500,
            msg: error.message,
            error: true
        });
    }
};
