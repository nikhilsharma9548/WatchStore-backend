import {v2 as cloudinary} from 'cloudinary'
import User from "../Models/User.model.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import { response } from 'express';



//Register user : /api/user/register
export const register = async( req, res) =>{

    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: "Missing Details"})
        }
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.json({success: false, message: "User Already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, password: hashedPassword})

       const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
       res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000
       })

      return res.json({success: true, user: ({email: user.email, name: user.name}), message: "User register "})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

//login user : /api/user/login

export const login =async(req, res) =>{

    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.json({success: true, message: "Invalid email or password"})
        }

        const user = await User.findOne({email})

        if(!user) {
           return res.json({success: false, message: "Invalid email or password"})
        }

        const isMatch  = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: "Invalid email or password"})
        }

         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
       res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000
       })

      return res.json({success: true, user: ({email: user.email, name: user.name}), message: "user Login successfully"})

    } catch (error) {
       console.log(error.message)
        res.json({success:false, message: error.message})
    }
 }

 // //isAuth user : /api/user/isAuth

 export const isAuth = async(req, res) =>{
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
 }

  // //logout user : /api/user/logout

   export const logout = async(req, res) =>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict"   
        })
         res.json({success:true, message: "Logged Out"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
 }

 //  upload user image : api/user/upload_image

export const uploadImage = async (req, res) => {
try {
       console.log("File from multer:", req.file); 
  if(!req.file){
    return res.json({success: true, message: "No image uploaded" })
  }

  //upload to cloudinary

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "user_profile"
  });

  const user = await User.findById(req.body.userId);
    user.image = result.secure_url;
    await user.save();
    
    res.json({ success: true, imageUrl: result.secure_url });
} catch (error) {
   res.status(500).json({ message: error.message });
}
};  
