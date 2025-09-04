import express from "express" 
import { isAuth, login, logout, register, uploadProfileImage } from "../Controllers/user.controller.js";
import userAuth from "../MiddleWare/authUser.middleware.js";
import { upload } from "../Configs/Multer.js";

const userRouter = express.Router();


userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth',userAuth, isAuth)
userRouter.post("/upload", userAuth, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
]), uploadProfileImage);
userRouter.post('/logout', logout)


export default userRouter