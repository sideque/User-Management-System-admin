import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import  Router  from "./Routes/Routes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("mongodb is connected"))
    .catch((error) => console.log(error))

    app.use("/", Router)
    app.listen(process.env.PORT, () => {
        console.log(`connected to the port ${process.env.PORT}`)
    })