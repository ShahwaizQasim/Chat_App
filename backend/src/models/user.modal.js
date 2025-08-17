import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "/api.png"
    },
    status: {
        type: String,
        status: ["offline", "online", "away"],
        default: "offline"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    lastActive: {
        type: Date,
        default: Date.now(),
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
    {
        timestamps: true
    }
)

const UserModel = mongoose.models.user || mongoose.model("User", UserSchema);

export default UserModel;