import type { NextFunction, Request, Response } from "express";
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from "jsonwebtoken";
interface Auth extends JwtPayload {
    id : number,
    role : string
}
export const platformUserAuth = (req : Request, res : Response, next : NextFunction)=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(400).json({
            success : false,
            message : 'Not authorized login again'
        })
    }
    const jwtsecret = process.env.JWT_SECRET
    if(!jwtsecret) return

    try{
        const decoded = jwt.verify(token, jwtsecret) as Auth
        if(decoded.id && decoded.role){
            req.user = {
                puId : decoded.id,
                puRole : decoded.role
            }
        }
        else {
            return res.json({
                success: false,
                message: 'Not Authorized Login Again'
            })
        }
        next()
    }catch(err){
    console.log(err)
    return res.status(500).json({
      success : false,
      message : 'Something went wrong'
    })
  }
}