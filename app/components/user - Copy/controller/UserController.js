const { validate } = require("uuid");
const userConfig = require("../../../model-config/userConfig");
const userService = require("../service/UserService");
const { HttpStatusCode } = require("axios");
const {v4}=require('uuid');
const { validateUuid } = require("../../../utils/uuid");
class UserController{
    constructor(){
      this.newUserService=userService
    }
    async createUser(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_CONTROLLER] : Inside createUser`);
        const user=req.body
        user.id=v4()
        userConfig.validateUser(user)
        const data =await this.newUserService.createUser(settingsConfig,user)
        res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async deleteUser(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_CONTROLLER] : Inside deleteUser`);
        const queryParams=req.query
        validateUuid(queryParams.id)
        await this.newUserService.deleteUser(settingsConfig,queryParams)
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
        const  data=await this.newUserService.getUser(settingsConfig,req.params)
        res.set('X-Total-Count',1)
        res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }
    async updateUser(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        const {userId}=req.params
        validateUuid(userId)
        const{parameter,newValue}=req.body
        logger.info(`[USER_CONTROLLER] : Inside updateUser`);
        switch(parameter){
            case "name":{ userConfig.validateName(newValue)
                         break;
            }
            case "age":{ userConfig.validateAge(newValue)
                            break;
                }
            case "gender":{ userConfig.validateGender(newValue)
                                   break;
                    }   
            case "username":{userConfig.validateUsername(newValue)

                break;
                } 
            case "password":{userConfig.validatePassword(newValue)

                break;
                }             
            default:{throw new Error("InValid Paramter To change")}
        }
      await  this.newUserService.updateUser(settingsConfig,parameter,newValue,req.params)
        res.status(HttpStatusCode.Ok).json("UserUpdated SuccessFully")
        } catch (error) {
            next(error)
        }
    }
    async login(settingsConfig, req, res, next) {
        try {
          const logger = settingsConfig.logger;
          logger.info(`[USER_CONTROLLER] : Inside login`);
          const bodyElement = req.body;
    
          const token = await this.newUserService.login(settingsConfig, bodyElement);
          res.cookie(process.env.AUTH_CLIENT_NAME, token);
          return res.status(200).json("Login Succesful");
        } catch (error) {
          next(error);
        }
      }
}
module.exports=new UserController()