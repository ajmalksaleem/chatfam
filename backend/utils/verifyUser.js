import jwt from 'jsonwebtoken'
import {errorHandler} from './error.js'

export const verifyUser = (req,res,next)=>{
    const token = req.cookies.access_token 
    if(!token){
        return next(errorHandler(401, 'NoToken'))
    }
    jwt.verify(token, process.env.JWT_SECRETKEY, (err,user)=>{
        if(err){
            return next(errorHandler(401, 'NoToken'))
        }
        req.user = user;
        next()
    })
}