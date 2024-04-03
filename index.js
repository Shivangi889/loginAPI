require('dotenv').config();
// const routes = require('./routes/routes');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
    useNewUrlParser: true
}).then(() => { console.log("Connected to database"); })
    .catch((e) => { console.log(e) });

const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

const JWT_SECRET ="srtrgvvghjnnkooppiobhbhvdrwr()hjgugu/jgyiuyiuhiuh/?[]fuyf";



require("./userDetails");

const User = mongoose.model("userInfo");

app.post("/register", async (req, res) => {

    const { fname,lname, email, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password,10);
    try {
      const oldUser = await User.findOne({email});

      if(oldUser){
       return res.send({error:"User Exists"});
      }



        await User.create({
               fname,
               lname,
               email,
               password:encryptedPassword,
        });
        res.send({ status: "OK" })
    } catch (error) {
        res.send({ status: "error" })
    }
});


app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User Not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET);
    //   , {
    //     expiresIn: "10s",
    //   });
  
      if (res.status(201)) {
        return res.json({ status: "ok", data: token });
      } else {
        return res.json({ error: "error" });
      }
    }
    res.json({ status: "error", error: "InvAlid Password" });
  });

  app.post("/getalluserdata", async(req,res)=>{
    const {token} = req.body;
    try{
        const user = jwt.verify(token, JWT_SECRET);
        User.find({})
        .then((data)=>{
            res.send({stats:"ok",data:data});
        })
        .catch((error)=>{
            res.send({status:"error",data:error});
        });
    }catch(error){}
  })

app.listen(5000, () => {
    console.log(`Server Started at ${5000}`)
});