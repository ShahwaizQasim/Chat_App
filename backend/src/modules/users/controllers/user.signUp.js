import UserModel from "../../../models/user.modal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../../constant/index.js";
import 'dotenv/config';


export const UserSignUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (
            [userName, email, password].some((field) => field?.trim() === "")
        ) {
            return res.status(400).send({ status: 400, msg: "all fields are required", error: true })
        }
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
        });

        const createdUser = await UserModel.findById(user._id).select(
            "-password"
        )

        if (!createdUser) {
            return res.status(500).send({ status: 500, msg: "Something Went Wrong", error: true })
        }

        const token = jwt.sign({ _id: user._id, email }, ENV.JWT_SECRET_KEY, {
            expiresIn: "1d" // 1 din ke liye token valid rahega
        });

        res.status(200).send({ status: 200, msg: "user added successfully", user: createdUser, error: false });

    } catch (error) {
        res.status(500).send({ status: 500, msg: error })
        console.log(error);
    }
}





// Difference samajh lo:

// 1️⃣ .create()
// Direct ek naya document banayega aur save bhi karega.
// Return karega wo newly created document jo DB me insert hua hai.


// 2️⃣ .new UserModel() + .save()

// Agar tum direct model ke andar dalna chahte ho to tumhe new keyword use karna hoga:
// Ye bhi wahi kaam karta hai, lekin 2 step process hai:
// Pehle ek instance banega (new UserModel)
// Phir manually .save() karna hoga