const nodemailer = require("nodemailer")
const crypto = require("crypto")
const db = require ("./mongo")
const bcrypt = require ("bcrypt");


const services = {
    //using crypto package to generate a token
    // which is send in user mail with help of node mailer
    
    async reset (req,res){
        crypto.randomBytes(32 ,async(err,buffer)=>{
            if(err){
                console.log(err)
            }
            const emailToken = buffer.toString("hex")
            const userEmail = await db.data.findOne({email : req.body.email})
            if(userEmail){
               db.data.updateOne({email : req.body.email},{$set:{reset : emailToken }})
               //mail id from where the mail will be send to the user
               let transporter = nodemailer.createTransport({
                   service:"gmail",
                   auth:{
                       user:"kolhapurkar131297@gmail.com",
                       pass: "xezpiorybavoisux"
                   }
               });
               //body to be present in the mail
               let mailOptions ={
                   from : "Password Reset",
                   to:req.body.email,
                   subject : "reset your password",
                   html : `
                   <p>click the <a href="https://reset-password895.netlify.app/${emailToken}">link</a> to reset your password</p>
                   <p>valid for 24 hrs only</p>
                   `
    
               };

               //sending back response to check mail to the user
               transporter.sendMail(mailOptions , function(error , info){
                   if(error){
                       console.log(error);
                   }else{
                       console.log("email sent :" + info.response)
                       res.send({message :"check your mail"})
                   }
               });
            }else{
                res.send({message : "Enter valid mail"})
            }
        })
        
     },

     //setting new password 
     async new_password (req , res){
        try{
           const salt = await bcrypt.genSalt()
           req.body.newpassword = await bcrypt.hash(req.body.newpassword , salt)
           const checkEmail = await db.data.findOne({reset:req.body.token})
              if(checkEmail){
               await db.data.findOneAndUpdate({reset:req.body.token},
                   {$set:{password : req.body.newpassword , reset : undefined}})
                   return res.send({message: "password reseted successfully"})
              }else{
               return res.send({message:"something went wrong"})
              }
             
        }catch(err){
           res.status(400).send(err)
        }
       
    }
}
module.exports = services;
