//convert normal string to secure format called hashing which is difficult to break password.for that use library bcrypt.
//01:08 hr (explanation whole)auth class - 1
const bcrypt = require("bcrypt");
const User = require("../model/User");//becz went with db using model
const jwt = require("jsonwebtoken");//import jwt
const {options} = require("../routes/user");
require("dotenv").config();

//signup route handler
exports.signup = async (req, res) =>{
    try{
       //1st work if i went to sign up - need all info from body
       const {name,email,password , role} = req.body//fetch 
       //check if user already exist  (check in db by findone)
       const existinguser = await User.findOne({email}); //userdata. becz model ka use kar rahe hain //find in db ki ish email se same koi email hai kya,then return

       if(existinguser){
         return res.status(400).json({
            success:false,
            message:'user already exists',
         });
       }
       //secure password
       let hashedpassword;
       try{
          hashedpassword = await bcrypt.hash(password,10);//.hash is use to secure/hash your password. arg(password->jishe tumhe secure karna hai, 10 -.no of round)
       }
       catch(err){
           return res.status(500).json({
            success:false,
            message:'error in hashing password',
           });
       }
       //create entry for user in db
       const user = await User.create({ //user ka data pass kardia /or entry create using model (userdata)
           name,email,password:hashedpassword,role //jo bhi user signup karne ka try kar raha tha uski entry DATABASE mai stotr ho chuki hai.
       })

       return res.status(200).json({
        success:true,
        message:'entry created succesfully',
       });
    }
    catch(err){
       console.error(err);
       return res.status(500).json({
        success:false,
        message:'user can not be register , please try again later',
       });
    }
}

//logain handler
exports.login = async(req,res) =>{
   try{
      //fetch data 
      const {email, password} = req.body;
      //validation email and password
      if(!email || !password){//means email ya pass mai data nahi pada hai return
          return res.status(400).json({
            success: false,
            message:'please , fill all the details carefully',
          });
      }
      //<user exist or not > or check for registered user
      let user = await User.findOne({email});//ish email id se koi id padi hai ki nahi
      //if not a registered user
      if(!user){
         return res.status(401).json({
            success:false,
            message:'user is not registered',
         });
      }
       //2.payload
       const payload ={
         email: user.email,
         id:user._id,//obj id
         role:user.role,
       };

      //1.verify password & generate JWT token  (bcrypt lib ka ek compare fun hai jish hum pass varify kar sakte hain (para1,para2))
      if(await bcrypt.compare(password ,user.password)){//jab passwrd varification ka kaam kar rahe ho tab hashing bhi kar rahe hoge.para1 -normal pass ,par2-encrypted data(user)
         //if password match then(login) before jwt token use need instance nd dwnld
      let token = jwt.sign(payload,                      //contains 3 para(header,payload,signature/secret)
                              process.env.JWT_SECRET,
                                 {
                                    expiresIn:"4h",
                                 });//token created
            user = user.toObject();
            user.token = token; //uper jo user create kiya user, token nam se user.token token ko insert kar diya
            user.password = undefined;//password ko user ke object mai se hataya taki or hide kardiya  becz ko mai send karunga - kiso email ke saath password na mil jai.user.(woh obj hai)
            
            const options = {
               expires: new Date(Date.now() +5000),
               httpOnly:true,//means we can not use this in clint side
            }
            //add cookie in response
            res.cookie("pradipcookie" , token, options).status(200).json({//3 para - cookie ka name, data, kuch options(validite,expiry,etc)
                success:true,
                token,
                user,
                message:'user logged in succesfully',
            });
         //    res.status(200).json({//3 para - cookie ka name, data, kuch options(validite,expiry,etc)
         //       success:true,
         //       token,
         //       user,
         //       message:'user logged in succesfully',
         //   });
      }
   else{
      //if password does not match
      return res.status(403).json({
         success:false,
         message:'Incorrect password',
      });

   }
}
   catch(error){
      console.log(error);
      return res.status(500).json({
         success:false,
         message:'login failure',
      });
   }
}

