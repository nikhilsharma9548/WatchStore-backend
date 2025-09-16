import express from 'express'
import userAuth from '../MiddleWare/authUser.middleware.js'
import { cancelOrder, getAllOrder, getUserOrder, placeOrderCOD, placeOrderStripe } from '../Controllers/order.controller.js'
import authAdmin from '../MiddleWare/authadmin.middleware.js'

const orderRouter = express.Router()

orderRouter.post('/cod', userAuth, placeOrderCOD)
orderRouter.get('/user', userAuth, getUserOrder)
orderRouter.get('/admin', authAdmin, getAllOrder)
orderRouter.post('/cancel',userAuth, cancelOrder)
orderRouter.post('/stripe', userAuth, placeOrderStripe)

export default orderRouter