import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false,
        default: "user"
    }
}, {timestamps: true})

export default mongoose.model("user", userSchema);