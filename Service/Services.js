import userSchema from "../Modals/userSchema.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashedPassword } from "../Utils/hashPassword.js"; 
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const AddUser = async (email, password, name) => {
    try {
        const duplicateEmail = await userSchema.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (duplicateEmail) {
            throw new Error("duplicate found")
        }

        const hashpass = await hashedPassword(password);
        const User = new userSchema({ name, email, password: hashpass })
        const saved = await User.save(); 

        if (saved) {
            return {
                success: true,
                user: {
                    id: saved._id,
                    name: saved.name,
                    email: saved.email,
                },
                message: "User registered successfully"
            }
        }
    } catch (error) {
        throw new Error(error.message)   
    }
} 

const Login = async (email, password) => {
    try {

        const user = await userSchema.findOne({ email: { $regex: `^${email}$`, $options: "i" } })
        if (!user) {
            throw new Error("User Not found")
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error("Password not Matches")
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        return {
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email, role: user.role }
        };

    } catch (error) {
        throw new Error(error)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Storing file to: ", path.join(__dirname, "../../Uploads"))
        cb(null, path.join(__dirname, "../Uploads"))
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName)
    }
})

const findUserAndUpdate = async (userId, file) => {
    try {
        if (!userId) {
            throw new Error("user not Found")
        }

        const user = await userSchema.findByIdAndUpdate(userId, { profileImage: file }, {new: true})
        return { success: true, image: user.profileImage, message: "added successfully" }
    } catch (error) {
        throw new Error(error.message)
    }
}

const Users = async (id) => {
    try {
        const user = await userSchema.findById(id);
        return user;
    } catch (error) {
        console.log(error, "error")
    }
}

const getData = async () => {
    try {
        const data = (await userSchema.find({ role: { $ne: "admin" } }, { password: 0 }).sort({ createdAt: -1 })).filter((data) => data != data.password)
        return data;
    } catch (error) {
        console.log(error, "error from getData")
    }
}

const searchData = async (searchval) => {
    try {
        const result = await userSchema.find({ name: { $regex: searchval, $options: "i" } })
        return result
    } catch (error) {
        console.log(error, "error from searchdata")
    }
}

const Delete = async (id) => {
    try {
        const res = await userSchema.findByIdAndDelete(id)

        if (res) {
            return {
                success: true,
                message: "Deleted Successfully"
            }
        }else{
            return {
                success: false,
                message: "Not Found the Deleted Data"
            }
        }
    } catch (error) {
        throw Error (error.message)
    }
}

const update = async (id, update) => {
    try {
        const duplicateEmail = await userSchema.findOne({ email: update.email, _id: {$ne: id} })
        if (duplicateEmail) {
            return {
                success: false,
                message: "Duplicate Found"
            }
        }

        const result = await userSchema.findByIdAndUpdate(id, update, { new: true })
        if (result) {
            return {
                success: true,
                message: "Updated Successfully"
            }
        }else{
            throw new Error("Updation Failed")
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const upload = multer({ storage });

export default {
    AddUser,
    Login,
    upload,
    findUserAndUpdate,
    Users,
    getData,
    searchData,
    Delete,
    update
}