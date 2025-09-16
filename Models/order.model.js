import e from "express";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId:{
        type:String,
        required: true,
        ref: 'user'
    },
items:[{
        product:{
            type:String,
            required: true,
            ref: "product"
        },
        quantity:{
            type:Number,
            required: true,
        },
    }],
     amount:{
            type:Number,
            required: true,
        },
    address:{
            type:String,
            required: true,
            ref: "address"
        },
    status:{
<<<<<<< HEAD
            type: String,
            enum: ['Order Placed', 'Cancelled'],
=======
            type:String,
            enum: ["Order placed","cancelled"],
>>>>>>> 6f3b089595944d151397a8fb8a0cdbf44523f9f8
            default: 'Order Placed'
        },
    paymentType:{
            type:String,
            required: true,
        },
    isPaid:{
            type:Boolean,
            required: true,
            default: false
        },
}, {timestamps:true})

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order;

