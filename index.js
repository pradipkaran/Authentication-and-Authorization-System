const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT   || 4000;
//cookie-parser import
const cookieParser = require("cookie-parser");
app.use(cookieParser()); 

app.use(express.json());//if they need anything from body through parsing use middleware

require("./config/database").connect();//DB connect

//route import and mount
const user = require("./routes/user");
app.use("/api/v1",user);

//activate

app.listen(PORT, () =>{
    console.log(`App is listening at ${PORT}`);
})