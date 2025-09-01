import express from 'express'
import userAuth from '../MiddleWare/authUser.middleware.js'
import { getAllOrder, getUserOrder, placeOrderCOD } from '../Controllers/order.controller.js'
import authAdmin from '../MiddleWare/AuthAdmin.middleware.js'

const orderRouter = express.Router()

orderRouter.post('/cod', userAuth, placeOrderCOD)
orderRouter.get('/user', userAuth, getUserOrder)
orderRouter.get('/admin', authAdmin, getAllOrder)

export default orderRouter