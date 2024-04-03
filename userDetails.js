const mongoose = require("mongoose");

const userDetailScehma = new mongoose.Schema(
    {
    fname: String,
    lname : String,
    email : {type:String, unique:true},
    password: String,
},{
    collection:"userInfo",
});
mongoose.model("userInfo",userDetailScehma);