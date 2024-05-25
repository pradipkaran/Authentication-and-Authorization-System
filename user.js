const express = require("express");
const router = express.Router();

//handler
const {login , signup} = require("../controller/Auth");
const {auth,isStudent , isAdmin} = require("../middlewares/auth");

router.post("/login",login);//path,handler
router.post("/signup",signup);  //signup se route handler pe jaoge auth.js


//testing protected route for single middleware
router.get("/test",auth ,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the protected  route for test',
    });
});

                                                     //jab /student api pe req aati hai then pehle auth middleware run hoga for checking authentication.
//protected routes                                   //then 2nd check isstutent for student role assign or not.jo token ke payload ke andar role define kiya tha woh authentication check karaga.
router.get("/student", auth , isStudent, (req,res) =>{ //yahan route/path ke saath ish path mai kon kon se middleware use honge
    res.json({
        success:true,
        message:'Welcome to the protected  route for student',
    });
});
router.get("/admin",auth,isAdmin, (req,res) =>{
    res.json({
        success:true,
        message:'Welcome to the protected  route for admin',
    });
});

module.exports = router;
//why we pass token ->1st we have to decode the token then after decoding have to find the role then compare that role.
