const { validate } = require("uuid");
const { HttpStatusCode } = require("axios");
const {v4}=require('uuid');
const { validateUuid } = require("../../../utils/uuid");
const bankService = require("../service/BankService");
const bankConfig = require("../../../model-config/bankConfig");
const { log } = require("winston");
class bankController{
    constructor(){
      this.newBankService=bankService
    }
    async createBank(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        logger.info(`[Bank_CONTROLLER] : Inside createBank`);
        const bank=req.body
        bank.id=v4()
        bankConfig.validateBank(bank)
        const data =await this.newBankService.createbank(settingsConfig,bank)
        res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }

    async getAllBank(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        const queryParams=req.query
        logger.info(`[bank_CONTROLLER] : Inside getAllbank`);
        const {rows,count} =await this.newBankService.getAllBank(settingsConfig,queryParams)
        res.set('X-Total-Count',count)
        res.status(HttpStatusCode.Ok).json(await rows)
        } catch (error) {
            next(error)
        }
    }
    
    async getBank(settingsConfig,req,res,next){
        try {
        const logger = settingsConfig.logger;
        logger.info(`[Bank_CONTROLLER] : Inside getBank`);
        const {bankId}=req.params
        validateUuid(bankId)
        const  data=await this.newBankService.getBank(settingsConfig,req.params)
        res.set('X-Total-Count',1)
        res.status(HttpStatusCode.Ok).json(await data)
        } catch (error) {
            next(error)
        }
    }


    async deleteBank(settingsConfig,req,res,next){
        try {
            const logger = settingsConfig.logger;
            logger.info(`[bankController] : Inside deleteBank`);

            const{bankId}=req.params
     console.log("############################",bankId);
            
            let deleteBank=await this.newBankService.deleteBank(settingsConfig,bankId)
            if(deleteBank==0){
                throw new Error("couldnot delete bank")
            }
            res.status(200).send("deleted sucessfully")
        } catch (error) {
            next(error)
        }
    }
    async updateBank(settingsConfig, req, res, next) {
        try {
            const logger = settingsConfig.logger;
            logger.info(`[bankController] : Inside updateBank`);
            
            const {bankId} = req.params
  
            

            const [bankToBeUpdated] = await this.newBankService.updateBank(settingsConfig,bankId, req.body)
            
            if(bankToBeUpdated==0){
                throw new Error("Could Not Update user")
            }
            res.status(HttpStatusCode.Ok).json("bank updated sucessfully")
            return
        } catch (error) {
            next(error)
        }
    }
 
}
module.exports=new bankController()