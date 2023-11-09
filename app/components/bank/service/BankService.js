const user = require("../../../../models/user");
const userConfig = require("../../../model-config/userConfig");
const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const bankConfig = require("../../../model-config/bankConfig");
class BankService{
    constructor(){

    }
    async createAbbrevation(settingsConfig,name){
       try {
        const logger = settingsConfig.logger;
        logger.info(`[BANK_SERVICE] : Inside CreateAbbrevation`);     
        let abbrevation=name.split(" ");
        let finalAbbrevation=""
        for(let index =0;index<abbrevation.length;index++){
            finalAbbrevation=finalAbbrevation+abbrevation[index][0]
        
        }
        return await finalAbbrevation
       } catch (error) {
        throw error
       }
    }
    async createbank(settingsConfig,bank){
        const t= await startTransaction() 
        try {
    
        const selectArray={
            id:bankConfig.fieldMapping.id,
            name:bankConfig.fieldMapping.name,
            abbrevation:bankConfig.fieldMapping.abbrevation,
         
            
        }
        console.log(this.createAbbrevation(settingsConfig,bank.name))
        bank.abbrevation=await this.createAbbrevation(settingsConfig,bank.name)
        const attributeToReturn=Object.values(selectArray)
        const logger = settingsConfig.logger;
        logger.info(`[BANK_SERVICE] : Inside CreateBank`);
    
        const bankExitence=await bankConfig.model.findOne({...parseFilterQueries(bank,bankConfig.filter,{[bankConfig.fieldMapping.name]:bank.name})})
       if(bankExitence==null)
{
    const data=await  bankConfig.model.create(bank,{transaction:t})
    t.commit()

    return data

}       
      throw new Error("Bank Exist With Same Name")
        
        } catch (error) {
            t.rollback()
            throw error
        }
    }
//     async deleteUser(settingsConfig,queryParams){
//         const t= await startTransaction() 
//         try {
    

//         const logger = settingsConfig.logger;
//         logger.info(`[USER_SERVICE] : Inside deleteUser`);
//         const userExitence=await userConfig.model.findOne({...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.id})})
//        if(userExitence==null)
// {
//    throw new Error("User Does Not Exists")

// }       
//    const data= await userConfig.model.destroy({...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.id})})
//         t.commit()
//         return data
//         } catch (error) {
//             t.rollback()
//             throw error
//         }
//     }
    async getAllBank(settingsConfig,queryParams){
        const t= await startTransaction() 
        
        try {

            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",queryParams);
        const selectArray={
            id:bankConfig.fieldMapping.id,
            name:bankConfig.fieldMapping.name,
            abbrevation:bankConfig.fieldMapping.abbrevation,
         
            
        }
            const attributeToReturn=Object.values(selectArray)

        const logger = settingsConfig.logger;
        logger.info(`[Bank_SERVICE] : Inside getAllBank`);
        const data=await bankConfig.model.findAndCountAll({ transaction: t,
            ...parseFilterQueries(queryParams, bankConfig.filter),
            attributes: attributeToReturn,
            ...parseLimitAndOffset(queryParams)})
       if(data==null)
{
   throw new Error("Record Does Not Exists")

}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async getBank(settingsConfig,queryParams){
        const t= await startTransaction() 
        try {
            
        const selectArray={
            id:bankConfig.fieldMapping.id,
            name:bankConfig.fieldMapping.name,
            abbrevation:bankConfig.fieldMapping.abbrevation,
         
            
        }
            const attributeToReturn=Object.values(selectArray)

        const logger = settingsConfig.logger;
        logger.info(`[Bank_SERVICE] : Inside getBank`);
        const data=await bankConfig.model.findOne({...parseFilterQueries(queryParams,bankConfig.filter,{[bankConfig.fieldMapping.id]:queryParams.bankId}),attributes:attributeToReturn})
if(data==null)
        {
   throw new Error("Bank Does Not Exists With Given Id")

}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
// async #updateName(settingsConfig,newValue,params){
//     const t= await startTransaction() 
    
//     try {
//         const logger = settingsConfig.logger;
//         logger.info(`[USER_SERVICE] : Inside updateName`);
//         await userConfig.model.update({[userConfig.fieldMapping.name]:newValue},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.username]:params.userId})})        
//     } catch (error) {
//         throw error
//     }
// }
// async #updateAge(settingsConfig,newValue,params){
//     const t= await startTransaction() 
    
//     try {
//         const logger = settingsConfig.logger;
//         logger.info(`[USER_SERVICE] : Inside updateAge`);
//         await userConfig.model.update({[userConfig.fieldMapping.age]:newValue},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.id]:params.userId})})        

//           t.commit()
//     } catch (error) {
//         t.rollback()
//         throw error
//     }
// }
// async #updateGender(settingsConfig,newValue,params){
//     const t= await startTransaction() 
    
//     try {
//         const logger = settingsConfig.logger;
//         logger.info(`[USER_SERVICE] : Inside updateGender`);
//         await userConfig.model.update({[userConfig.fieldMapping.gender]:newValue},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.id]:params.userId})})        
//     } catch (error) {
//         throw error
//     }
// }
// async #updateUserName(settingsConfig,newValue,params){
//     const t= await startTransaction() 
    
//     try {
//         const logger = settingsConfig.logger;
//         logger.info(`[USER_SERVICE] : Inside updateUserName`);
        
        
//         const userExitence=await userConfig.model.findOne({...parseFilterQueries(user,userConfig.filter,{[userConfig.fieldMapping.username]:newValue})})
//         if(userExitence==null)
//  {
//     await userConfig.model.update({[userConfig.fieldMapping.username]:newValue},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.id]:params.userId})})        

//      t.commit()
 
//      return 
 
//  }       
//        throw new Error("User Exist With Same UserName,Please Use Diffrent Username")
         
//          } catch (error) {
//              t.rollback()
//              throw error
//          }
        
// }
// async #updatePassword(settingsConfig,newValue,params){
//     const t= await startTransaction() 
    
//     try {
//         const newPassword=await bcrypt.hash(newValue,12)
//         const logger = settingsConfig.logger;
//         logger.info(`[USER_SERVICE] : Inside updatePassword`);
//         await userConfig.model.update({[userConfig.fieldMapping.password]:newPassword},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.id]:params.id})})        
//     } catch (error) {
//         throw error
//     }
// }
// async updateUser(settingsConfig,parameter,newValue,params){
//     const t= await startTransaction() 
// try {
//     const logger = settingsConfig.logger;
//     logger.info(`[USER_SERVICE] : Inside updateUser`);
//     switch(parameter){
//         case "name":{await this.#updateName(settingsConfig,newValue,params)
//         return
//         }
//         case "age":{await this.#updateAge(settingsConfig,newValue,params)
//             return
//             }
//         case "gender":{await this.#updateGender(settingsConfig,newValue,params)
//                 return
//                 }   
//         case "username":{await this.#updateUserName(settingsConfig,newValue,params)
//             return
//             } 
//         case "password":{await this.#updatePassword(settingsConfig,newValue,params)
//             return
//             }             
//         default:{throw new Error("InValid Paramter To change")}
//     }
    
// } catch (error) {
//     t.rollback()
//     throw error
// }
// }


async updateBank(settingsConfig, bankId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside updateBank`);
  
      let bankToBeUpdate = await bankConfig.model.update(body, {
        where: { id: bankId },
        transaction: t,
      });
  
      t.commit();

      return bankToBeUpdate;
   
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  async deleteBank(settingsConfig,bankId){
    try {
        const logger = settingsConfig.logger;
        logger.info(`[bankService] : Inside deleteBank`);
        const bankToBeDeleted=await bankConfig.model.destroy({where:{id:bankId}})
        return bankToBeDeleted
    } catch (error) {
        throw error
    }
}

}
const bankService=new BankService()
module.exports=bankService