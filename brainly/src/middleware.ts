import express, { Request,Response,NextFunction } from "express";
import z, { string } from "zod";
import { User } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET="123123";
const signSchema=z.object({
    userName:z.string().min(7,{message:"must constain 7 characters"}),
    password:z.string().min(8)
})
const contentSchema=z.object({
    link:z.string(),
    type:z.string(),
    title:z.string(),
    tag:z.string(),
    userId:z.string()
})
export const signinmiddleware=async function (req:Request,res:Response,next:NextFunction){
    try{const parsed=  signSchema.safeParse(req.body);
if(!parsed.success){
    return res.status(400).json({
        error:"invalid username or password"
    })}
    const {userName,password}=parsed.data;
    const user=await User.findOne({userName});
if(!user){
    return res.status(401).json({
        message:"invalid username "
    })
}
  const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message:"invalid password"
        })
    }
     req.user={
        id:user._id.toString(),
        userName:user.userName
    }
    next();

}
catch(err){
    return res.status(500).json({
        message:"signin endpoint failed"
    })
}

}
export const contentmiddleware= async (req:Request,res:Response,next:NextFunction)=>{

try{
    const header=req.headers.authorization;
if(!header){
    return res.status(401).json({
        message:"authorization header missing"
    })
}
const token =header.split(" ")[1];
if(!token){
    return res.status(401).json({
        message:"token missing"
    }) 
}
const decode =jwt.verify(token,JWT_SECRET) as {
    userId:string;
};
req.user1={
    id:decode.userId
}
next();
}
catch(err){
    console.log(err);
    return res.status(500).json({
        message:"invalid or expires token",
       
    })
}

}