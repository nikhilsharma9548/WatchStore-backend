import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    image:{
        type:String,
        default: ""
    },
    cartItems:{
        type:Object,
        default: {}
    },
}, {minimize : false})

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User;

