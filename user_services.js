const db = require ("./mongo")
const bcrypt = require ("bcrypt");
const jwt = require ("jsonwebtoken");

const services ={
    //registeration process
    async register (req, res){
        try{
            const user = await db.data.findOne({email : req.body.email})
            if(user){
               return  res.send({message :"User Already exists"})
            }else{
                const salt = await bcrypt.genSalt()
                req.body.password = await bcrypt.hash(req.body.password , salt)
                await db.data.insertOne(req.body)
                return res.send({message :"Registered successfully"})
            }
        }catch(error){
            res.status(500).send("something went wrong")
        }
      
    },

    //login process
    async login (req , res){
        try{
            const user = await db.data.findOne({email : req.body.email})
        if(!user){
            return res.send({message : "Enter valid Email-Id"})
        }else{
            const isValid = await bcrypt.compare(req.body.password , user.password)
            if(isValid){
                const authToken = jwt.sign({user_id : user._id , email: user.email} , "admin123",{expiresIn :"24h"})
                console.log(authToken)
                return res.send({authToken , message: "Logged In Successfully"})
            }else{
                res.send({message : "Entered password is wrong"})
            }
         } 
        }catch(error){
            res.status(500).send("something went wrong try again")
        }
       
   
    }
}

module.exports = services ; 