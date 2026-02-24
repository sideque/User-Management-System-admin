import express from 'express';
const Router = express.Router();

import AdminMiddleware from '../Middleware/AdminAuthMiddleware.js';
import userController from "../Controller/userController.js"
import AuthMiddleware from "../Middleware/AuthMiddleware.js";
import Services from '../Service/Services.js';

Router.post("/register", userController.Register);
Router.post("/login", userController.Loign);
Router.post("/upload", AuthMiddleware, Services.upload.single('image'), userController.Upload);
Router.get("/userDetails", AuthMiddleware, userController.getUser);
Router.get("/getData", AdminMiddleware, userController.getData);
Router.get("/search", AdminMiddleware, userController.Serach);
Router.delete("/delete/:id", AdminMiddleware, userController.Delete);
Router.patch("/edit/:id", AdminMiddleware, userController.update);

export default Router;