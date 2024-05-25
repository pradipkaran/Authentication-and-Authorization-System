require("dotenv").config();
const mongoose = require("mongoose");



exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
           //useNewUrlParser:true,
           //useUnifiedTopology:true 
    })
    .then(() => {console.log("Db connected sucessesfully");

    })
    .catch((error)=>{
        console.log("DB connection ISSUES",error);
        //console.error(err);
        process.exit(1);
    });
};