const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const {User} = require('../models/user')
const jwt  = require('jsonwebtoken')

router.post("/", async(req,res)=>{
   try{
     const user = await User.findOne({email : req.body.email})
   
     if(user){
        bcrypt.compare(req.body.password,user.password,(err,response)=>{
            if(response){
                const token = jwt.sign({email:user.email},process.env.JWT_SECRET_KEY,{expiresIn : "7d"});
                
                res.status(200).send({token: token,message:"Token stored successfully"})
            }else{
                res.status(404).send("Invalid email or password")
            }
        })
     }
     else{
        res.status(401).send("User not found")
     }
   }catch(error){
      res.status(500).send("Internal server error")
   }
})

module.exports = router;