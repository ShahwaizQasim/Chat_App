import { ENV } from "../constant/index.js";
import UserModel from "../models/user.modal.js";
import jwt from 'jsonwebtoken'

const VerifyUser = async (req, res, next) => {
  try {
    
    if (!req?.headers?.authorization) {
      return res.status(401).send({
        status: 401,
        message: "No Authorization Header",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY);
    // console.log("decoded", decoded);

    if (!decoded) {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized Token",
      });
    }

    const user = await UserModel.findById(decoded._id).lean();
    // console.log("user++++", user);

    if (!user) {
      return res.status(404).send({
        status: 404,
        error: true,
        message: "User Not Found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "error in authentication",
    });
  }
};

export {
    VerifyUser
}