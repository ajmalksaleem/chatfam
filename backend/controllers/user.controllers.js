import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"; 
import jwt from "jsonwebtoken";

export const userSignup = async(req,res,next)=>{
    const {name, email, password, pic} = req.body
    if(!name || !email, !password) return next(errorHandler(400, 'require all fields'))
    try {
        const userExists = await User.findOne({ email });
  if (userExists) {
    return next(errorHandler(400,"User already exists"))
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await User.create({
    email,password : hashedPassword ,name,pic
  })
  res.status(201).json('user created')
    } catch (error) {
     next(error)   
    }
} ;


export const userSignin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "All field required"));
    }
    try {
      const foundUser = await User.findOne({ email });
      if (!foundUser) return next(errorHandler(400, "User not found"));
      const validdatePassword = bcryptjs.compareSync(
        password,
        foundUser.password
      );
      if (!validdatePassword)
        return next(errorHandler(401, "Password or Email is incorrect"));
      const token = jwt.sign({ id: foundUser._id}, process.env.JWT_SECRETKEY, {
        expiresIn: "1d",
      });
      res.status(200).cookie("access_token", token, { httpOnly: true });
      const { password: pass, ...rest } = foundUser._doc;
      res.json(rest);
    } catch (error) {
      next(error);
    }
  };

  export const searchUsers = async(req,res,next)=>{
   try {
    const keyword = req.query.search || ''
    const users = await User.find({
      _id:{$ne:req.user.id},
      $or:[
        {name : {$regex : keyword, $options : 'i'}},
        {email : {$regex : keyword, $options : 'i'}}
      ]
    }).select("-password")
    res.status(200).json(users)
   } catch (error) {
    next(error)
   }
  }

  
  export const SignOut = async (req, res, next) => {
    try {
      res
        .clearCookie("access_token")
        .status(200)
        .json("user has been signed out");
    } catch (error) {
      next(error);
    }
  };
