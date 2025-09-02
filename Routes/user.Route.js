import express from "express" 
import { isAuth, login, logout, register } from "../Controllers/user.controller.js";
import userAuth from "../MiddleWare/authUser.middleware.js";

const userRouter = express.Router();


userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth',userAuth, isAuth)
router.post("/upload-profile", userAuth, upload.single("image"), uploadProfileImage);
userRouter.post('/logout', logout)


export default userRouter