import express from "express"
import { adminLogin, adminLogout, isAdminAuth } from "../Controllers/admin.controller.js";
import authAdmin from "../MiddleWare/authAdmin.middleware.js";

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/is-auth',authAdmin, isAdminAuth);
adminRouter.post('/logout', adminLogout);

export default adminRouter;