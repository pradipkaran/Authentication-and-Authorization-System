const mongoose = require("mongoose");
//making schema
const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required:true,
        trim: true,
     },
     email:{
        type:String,
        required:true,
        trim:true,
     },
     password:{
        type:String,
        required:true,
     },
     role:{
        type:String,
        enum:["Admin","Student","Visitor"]//when we define enum then the space of the role will be limit (only use these 3) 
     }
});
module.exports = mongoose.model("user",userSchema);