import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import 'dotenv/config';
import UserModel from "../models/user.modal.js"
import { ENV } from "../constant/index.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { messageModel } from "../models/userMessage.modal.js";

const UserSignUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName) {
            return res.status(400).send({ status: 400, msg: "userName is required", error: true })
        }
        if (!email) {
            return res.status(400).send({ status: 400, msg: "email is required", error: true })
        }
        if (!password) {
            return res.status(400).send({ status: 400, msg: "password is required", error: true })
        }

        const User_Profile_Picture_Path = req.file?.path;
        console.log(User_Profile_Picture_Path);


        if (!User_Profile_Picture_Path) {
            res.status(400).send({
                status: 400,
                message: "Profile Picture is required",
                error: true,
            });
        }

        const User_Profile_Picture = await uploadOnCloudinary(User_Profile_Picture_Path);

        const existedUser = await UserModel.findOne({
            $or: [{ userName }, { email }],
        })
        if (existedUser) {
            return res.status(400).send({ status: 400, msg: "user with email and userName already exists", error: true })
        }
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        const user = await UserModel.create({
            userName,
            email,
            password: passwordHash,
            profilePicture: User_Profile_Picture?.url
        });

        res.status(200).send({ status: 200, msg: "user added successfully", error: false });

    } catch (error) {
        res.status(500).send({ status: 500, msg: error })
        console.log(error);
    }
}

const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send({ status: 400, msg: "email is required", error: true })
        }
        if (!password) {
            return res.status(400).send({ status: 400, msg: "password is required", error: true })
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                const token = jwt.sign(
                    { _id: user._id, email, user: user?.userName },
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

// All users Get 
const UserGet = async (req, res) => {
    try {
        const loggedInUserId = req?.user?.id;

        const allUsersGet = await UserModel.find({
            _id: { $ne: loggedInUserId }, // khud ko hide karne ke liye
        }).select("-password");

        const usersWithUnreadCount = await Promise.all(
            allUsersGet.map(async (user) => {
                const unreadCount = await messageModel.countDocuments({
                    senderId: user?._id,
                    receiverId: loggedInUserId,
                    isRead: false,
                });

                return {
                    ...user.toObject(),
                    unreadCount,
                };
            })
        );

        res.status(200).send({
            status: 200,
            msg: "user fetch successfully",
            users: usersWithUnreadCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 500,
            msg: "Internal Server Error",
        });
    }
};

export {
    UserSignUp,
    UserLogin,
    UserGet
}
