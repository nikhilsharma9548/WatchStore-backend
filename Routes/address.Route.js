import express from "express"
import userAuth from "../MiddleWare/authUser.middleware.js";
import { addAddress, getAddress } from "../Controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.post('/add', userAuth, addAddress)
addressRouter.get('/get', userAuth, getAddress)

export default addressRouter