import UserModel from "../../../models/user.modal.js";


const UserGet = async (req,res) => {
    try {
      const allUsersGet = await UserModel.find().select("-password");
      res.status(200).send({status: 200, msg: "user fetch successfully", users: allUsersGet})
    } catch (error) {
        res.status(500).send({status:500, msg: "Internal Server Error"})
    }
}

export default UserGet