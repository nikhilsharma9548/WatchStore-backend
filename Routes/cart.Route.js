import express from "express";
import userAuth from "../MiddleWare/authUser.middleware.js";
import { updateCart } from "../Controllers/Cart.controller.js";

const cartRouter = express.Router()

cartRouter.post('/update', userAuth, updateCart)

export default cartRouter;