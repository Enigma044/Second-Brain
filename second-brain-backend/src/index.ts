import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Content, User } from './db.js';
import bcrypt from "bcrypt";
import z from 'zod';
import { contentmiddleware, signinmiddleware } from './middleware.js';
const JWT_SECRET="123123";
const app=express();
app.use(express.json());
const UserSchema=z.object({
    userName:z.string().min(7,{ message: "Must be at least 7 characters" }),
     password :z
  .string()
  .min(8, { message: "Must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" })
});

const ContentSchema=z.object({

});
app.post("/api/v1/signup",async (req,res)=>{
   try{
         const userName=req.body.userName;
    const password=req.body.password;
    const result=UserSchema.safeParse({userName,password});
if(!result.success){
    return res.status(411).json({
        message:result.error.issues
    })
}
const alreadyexist= await User.findOne({userName:userName});
if(alreadyexist){
    return res.status(409).json({
        message:"user already found"
    })
}
const salt = 10;

const hashPassword = await bcrypt.hash(password,salt);
const user= await User.create({
    userName:userName,
    password:hashPassword
})

return res.status(200).json({
    message:"User created successfully",
    userId:user._id
})
    }
    catch(err){
return res.status(500).json({
    message:"Internal server error"
})
    }

   
   
})



app.post("/api/v1/signin",signinmiddleware,async(req,res)=>{
    try{
        const token=jwt.sign({userId:req.user.id},JWT_SECRET);
        return res.status(200).json({
            message:"signin successfully",
            token
        })
       

    }
    catch(err){
         return res.status(500).json({
      message: "Token generation failed",
    });

    }
    
})



app.post("/api/v1/content",contentmiddleware,async(req,res)=>{
    
    try{
      const {link,title,type}=req.body;
      const userId=req.user1.id;
      const content=await Content.create({
        link,title,userId,
        tags:[],type
      })
      if(!content){
return res.status(404).json({
    message:"content not added"
})
      }
return res.status(200).json({
    message:"content added"
})
    }
    catch(err){
        console.log(err);
return res.status(500).json({
    message:"error"
})
    }
})



app.get("/api/v1/content", contentmiddleware, async (req, res) => {
  try {
    const userId = req.user1.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const content = await Content.find({ userId }).populate("userId","userName");

    return res.status(200).json({
      content,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch content",
    });
  }
});

app.get("/api/v1/content/search", contentmiddleware, async (req, res) => {
  try {
    const userId = req.user1.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
const searchValue=req.query.searchValue as string;

    if (!searchValue) {
      return res.status(400).json({
        message: "searchValue query param is required",
      });
    }
    const content = await Content.find({ userId ,
        title:{
            $regex:searchValue,
            $options: "i",
        }
    }).populate("userId","userName")

    return res.status(200).json({
      content,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch content",
    });
  }
});



app.delete("/api/v1/content", contentmiddleware, async (req, res) => {
  try {
    const { contentId } = req.body;
    const userId = req.user1.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!contentId) {
      return res.status(400).json({
        message: "contentId is required",
      });
    }

    const result = await Content.deleteOne({
      _id: contentId,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Content not found or not authorized",
      });
    }

    return res.status(200).json({
      message: "Content deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete content",
    });
  }
});

app.post("/api/v1/brain/share",(req,res)=>{
    
})
app.get("/api/v1/brain/:shareLink",(req,res)=>{
    
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});