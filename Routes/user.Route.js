import express from "express" 
import { isAuth, login, logout, register, uploadImage } from "../Controllers/user.controller.js";
import userAuth from "../MiddleWare/authUser.middleware.js";
import { upload } from "../Configs/Multer.js";

const userRouter = express.Router();


userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth',userAuth, isAuth)
userRouter.put('/theme',userAuth, updateTheme)
userRouter.post("/upload",upload.single("image"),  userAuth, uploadImage);
userRouter.post('/logout', logout)


export default userRouter