//3 middleware - auth , isStudent , isAdmin
//we know we work with jwt token so i need the instance
const jwt = require("jsonwebtoken");
require("dotenv").config();

//verify token and check authenticity
exports.auth = (req , res , next) =>{ //after 1 middleware complete have to call next() for another middleware.
    try{
         //here we check authentication so we extract JWT token from - req.body.token,req.cookie,req.header
         console.log("cookie",req.cookies.token);
         console.log("body",req.body.token);
         console.log("header", req.header("Authorization"));

         const token =  req.cookies.token  || req.body.token || req.header("Authorization").replace("Bearer ", "");
         //maybe token is not present there
         if(!token || token === undefined){
            return res.status.json(401).json({
                success:false,
                message:'Token missing',
            });
         }
         //verify the token
         //means- aap jab login kiye the aap ko ek token mila tha agar aap ek valid token send karpainge then authentic user
         try{
              const payload = jwt.verify(token , process.env.JWT_SECRET);//verify fun - give u decoded obj, token ke andar jo val hai woh dedega role,user...
              console.log(payload);
            //why to store in req - later we check whether it is student or nor (role) and role is in payload and payload 
              req.user = payload;    //jo bhi payload ka ans aya usko req ke ander use karliya //usko use kiya becz nicha role check karunga 
         }
         catch(err){
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
         }
         next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:'something went wrong, while verifing the token',
    });
    }

}

//both middle are check roles means(checking authorization)
exports.isStudent = (req,res,next) =>{
    try{
         if(user.req.role !== "Student"){
            return res.status(401).json({
                success: false,
                message:'This is a protected route for student',
            });
         }
         next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:'user role is not matching',
    });
    }
}

exports.isAdmin = (req,res,next) =>{
    try{
         if(user.req.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message:'This is a protected route for Admin',
            });
         }
         next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:'user role is not matching',
    });
    }
}