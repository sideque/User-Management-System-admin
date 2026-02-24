
import Services from "../Service/Services.js";

const Register = async (req, res) => {
    try {

        const { email, password, name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and Password not found" })
        }

        const saved = await Services.AddUser(email, password, name)
        if (saved.success) {
            return res.status(200).json({ success: true, message: "User Created Successfully" })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const Loign = async (req, res) => {
    try {
        const {email, password} = req.body;
        const login = await Services.Login(email, password)
        if (login) {
            return res.status(200).json({ success: true, login, message: "Welcome to the page" })
        }else{
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }
    } catch (error) {
        console.log(error.message, "Error from Login Roate")
        return res.status(500).json({ success: false, message: error.message })
    }
}

const Upload = async (req, res) => {
    try {
        const userId = req.user.id;
        const findUser = await Services.findUserAndUpdate(userId, req.file.filename)

        if (findUser.success) {
            return res.status(200).json({ success: true, image: findUser.image, message: "Profile Pitcher added Successfully" })
        }
    } catch (error) {
        console.log(error, "Error from Upload")
        return res.status(500).json({ success: false, message: error.messsage })
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Services.Users(userId)
        res.status(200).json({ success: true, user, message: "ready" })
    } catch (error) {
        console.log(error, "error")
    }
}

const getData = async (req,res) => {
    try {
        const datas = await Services.getData()
        res.status(200).json({ success: true, data: datas, message: "Successfully fetched" })
    } catch (error) {
        console.log(error, "Error from getData")
    }
}

const Serach = async (req, res) => {
    const searchval = req.query.q
    let data = null;

    try {
        if (!searchval) {
            data = await Services.getData()
            return res.status(200).json({ success: true, data: data, message: "Success" })
        }else{
            data = await Services.searchData(searchval)
            return res.status(200).json({ success: true, data: data, message: "Success" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

const Delete = async (req,res) => {
    const id = req.params.id;
    try {
        const result = await Services.Delete(id)
        const datas = await Services.getData();

        if (result.success) {
            return res.status(200).json({ success: true, data: datas, message: "Deleted Successfully" })
        }else{
            return res.status(500).json({ success: false, data: datas, message: "Failed to delete" })
        }
    } catch (error) {
        console.log(error, "Error from Delete Roaute")
        return res.status(500).json({ success: false, message: "Something wend wrong" })
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = req.body
        const result = await Services.update(id, updated)

        if (result.success) {
            res.status(200).json({ success: true, message: "updated Successfully" })
        }
        if (!result.success) {
            res.status(550).json({ success: false, message: "Duplicate Found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "An Error occured" })
    }
}

export default {
    Register,
    Loign,
    Upload,
    getUser,
    getData,
    Serach,
    Delete,
    update
}