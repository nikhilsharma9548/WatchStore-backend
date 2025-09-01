import mongoose from "mongoose"


const addressSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        default: ""
    },
   email:{
        type:String,
        required: true,
        unique:true
    },
    street:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    state:{
        type:String,
        required: true
    },
    zipcode:{
        type:Number,
        default: true
    },
    country:{
        type:String,
        default: true
    },
    phoone:{
        type:Number,
        default: true
    },
    
},{timestamps: true})

const Address = mongoose.models.address || mongoose.model('address', addressSchema)

export default Address;