const { validate } = require("uuid");
const nodemailer=require('nodemailer')
const userConfig = require("../../../model-config/userConfig");
const userService = require("../service/UserService");
const { HttpStatusCode } = require("axios");
const {v4}=require('uuid');
const { validateUuid } = require("../../../utils/uuid");
const { checkJwtHS256 } = require("../../../middleware/authService");
class UserController{
    constructor(){
      this.newUserService=userService
    }


async forgotPassword(settingsConfig,req,res,next){
    try {
        let response=await this.sendEmail(req.body.recipient_email,req.body.OTP)
        return res.status(HttpStatusCode.Ok).json({response})
    } catch (error) {
        next(error)
    }
}



    async sendEmail(recipient_email, OTP) {
        console.log(recipient_email, "REEEEEEEEE", OTP, "OTPPPPPPPP")
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'helpdeskbankingapp@gmail.com',
                    pass: 'pccp pfrk vwwe rsvy',
                },
                // service: 'gmail',
                // host: 'smtp.gmail.com',
                // auth: {
                //     user: 'your gmail here',
                //     pass: 'your app generated password here',
                // },
            });

            const mail_configs = {
                from: 'helpdeskbankingapp@gmail.com',
                to: recipient_email,
                subject: "AkshayBankingApp 101 PASSWORD RECOVERY",
                html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Koding 101</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Koding 101 Inc</p>
      <p>1600 Amphitheatre Parkway</p>
      <p>California</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
            };
            console.log(mail_configs, "mailconfigs//////////");
            transporter.sendMail(mail_configs, function (error, info) {
                if (error) {
                    console.log(error);
                    throw new Error("An error has occured")
                    // return reject({ message: An error has occured });
                }
                return resolve({ message: "Email sent succesfuly" });
            });
        });
    }
    async createUser(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_CONTROLLER] : Inside createAdmin`);
        const{name,username,password,age,gender}=req.body
     const user=await this.newUserService.getUserByUsername(settingsConfig,username)
     if(user.length != 0){
        throw new Error("username Already Taken")
    }
        const data =await this.newUserService.createUser(settingsConfig,req.body)
        res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async createAdmin(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_CONTROLLER] : Inside createAdmin`);
        const{firstName,lastName,username,password}=req.body
     const user=await this.newUserService.getUserByUsername(settingsConfig,username)
     if(user.length != 0){
        throw new Error("username Already Taken")
    }
        const data =await this.newUserService.createAdmin(settingsConfig,req.body)
        res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async check(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[UserController] : Inside check`);
            const{username}=req.body


            if(!username){
               return res.status(200).json({result:false})
            }
            const payload=checkJwtHS256(settingsConfig,req,res,next)
            if(!payload){
                return res.status(200).json({result:false})
            }
            const response=await this.newUserService.verifyUser(settingsConfig,payload,username)
            return res.status(200).json({result:response})
        } catch (error) {
            return res.status(200).json({result:false})
        }
    }
    async checkPassword(settingsConfig,req,res,next){
        try {
            const logger = settingsConfig.logger;
              logger.info(`[UserController] : Inside checkPassword`);
            
            const{username,oldPassword,newPassword}=req.body
            const payload=checkJwtHS256(settingsConfig,req,res,next)
            if(payload.username!=username){
          
                throw new Error("invalid username")
            }
            const newpssd=await this.newUserService.checkingPassword(settingsConfig,username,oldPassword,newPassword)
            if(newpssd==0){
                throw new Error("cannot update password")
            }
            res.status(HttpStatusCode.Ok).json("password reset sucessfully")
            return
    
        } catch (error) {
            next(error)
        }
    }
    async reset(settingsConfig,req,res,next){
        try {
            const logger = settingsConfig.logger;
            logger.info(`[USER_CONTROLLER] : Inside reset`);
            const{username,newPassword}=req.body

            const passwordReset=await this.newUserService.resetpass(settingsConfig,username,newPassword)
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4",passwordReset);
            if(passwordReset==0){
                throw new Error("cannot reset password")
            }
            res.status(HttpStatusCode.Ok).json("password reset sucessfully")
            return
        } catch (error) {
            
        }
    }
    async deleteUser(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_CONTROLLER] : Inside deleteUser`);
        const{userId}=req.params
       
        await this.newUserService.deleteUser(settingsConfig,userId,req.query)
        res.set('X-Total-Count',0)
        res.status(HttpStatusCode.Ok).json("User Deleted Successfully")
        } catch (error) {
            next(error)
        }
    }
    async getAllUser(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        const queryParams=req.query
        logger.info(`[USER_CONTROLLER] : Inside getAllUser`);
        const {rows,count} =await this.newUserService.getAllUser(settingsConfig,queryParams)
        res.set('X-Total-Count',count)
        res.status(HttpStatusCode.Ok).json(await rows)
        } catch (error) {
            next(error)
        }
    }
    
    async getUser(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_CONTROLLER] : Inside getUser`);
        const {userId}=req.params
        validateUuid(userId)
        const  data=await this.newUserService.getUser(settingsConfig,userId,req.params)
        res.set('X-Total-Count',1)
        res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async updateUser(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[UserController] : Inside updateUser`);
            
            const {userId} = req.params
            
            const user = await this.newUserService.getUser(settingsConfig, userId,req.query)
            if(user.length == 0){
                throw new Error("User Not Found!")
            }

            const [userToBeUpdated] = await this.newUserService.updateUser(settingsConfig,userId, req.body)
           
            if(userToBeUpdated==0){
                throw new Error("Could Not Update user")
            }
            res.status(HttpStatusCode.Ok).json("user updated sucessfully")
            return
        } catch (error) {
            next(error)
        }
    }
    async login(settingsConfig, req, res, next) {
        try {
          const logger = settingsConfig.logger;
          logger.info(`[USER_CONTROLLER] : Inside login`);
          const bodyElement = req.body;
          const queryParams=req.query
    
          const [token,user] = await this.newUserService.login(settingsConfig, bodyElement,queryParams);
         
          res.set(process.env.AUTH_CLIENT_NAME,token)

          res.cookie(process.env.AUTH_CLIENT_NAME, token);
          return res.status(200).json(user);
        } catch (error) {
          next(error);
        }
      }
    async logout(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[UserController] : Inside logout`);
            
            res.cookie(process.env.AUTH_COOKIE_NAME,"", {expires: new Date(Date.now())});
            res.status(HttpStatusCode.Ok).json("Logout")
        } catch (error) {
            next(error)
        }
    }
}
module.exports=new UserController()