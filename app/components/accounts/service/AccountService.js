const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const accountConfig = require("../../../model-config/accountConfig");
const bankConfig = require("../../../model-config/bankConfig");
const { validateUuid } = require("../../../utils/uuid");
const transactionConfig = require("../../../model-config/transactionConfig");
const {v4}=require('uuid');
const { Op } = require("sequelize");

class AccountService{
    constructor(){

    }
    async createAccount(settingsConfig,account){
        const t= await startTransaction() 
        try {
            const logger = settingsConfig.logger;
            logger.info(`[account_SERVICE] : Inside CreateAccount`);
            
      console.log("account",account);
        // const bankName=await bankConfig.model.findOne({...parseFilterQueries(account,bankConfig.filter,{[bankConfig.fieldMapping.id]:account.bankId})})
       

            const findBank=await bankConfig.model.findOne({where:{name:account.bankName}})
            console.log(findBank);
        if(findBank==null){
            throw Error("Bank With Given BankId Does NOT Exists")
        }
       

        // account.bankName=findBank.dataValues.name
        account.bankId=findBank.dataValues.id
let date = new Date()
    const data=await  accountConfig.model.create(account,{transaction:t})
   let  transaction={
        id:v4(),
        date:date.toLocaleDateString(),
        amount:account.balance,
        currentBalance:account.balance,
        type:"Account Opening Charges",
        accountId:account.id
    }
  await transactionConfig.model.create(transaction,{transaction:t})

    t.commit()

    return data
       
        
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async getAllAccount(settingsConfig,queryParams,queryParamss){
        const t= await startTransaction() 
        
        try {
        const logger = settingsConfig.logger;
        logger.info(`[Account_SERVICE] : Inside getAllAccount`);
        

        const selectArray={
            id:accountConfig.fieldMapping.id,
            bankId:accountConfig.fieldMapping.bankId,
            bankName:accountConfig.fieldMapping.bankName,
            balance:accountConfig.fieldMapping.balance,
            // userId:accountConfig.fieldMapping.userId
         
            
        }
        const attributeToReturn=Object.values(selectArray)
        const data=await accountConfig.model.findAndCountAll({ transaction: t,
            ...parseFilterQueries(queryParamss, accountConfig.filter,{[accountConfig.fieldMapping.userId]:queryParams.userId}),
            attributes: attributeToReturn,
            ...parseLimitAndOffset(queryParamss)})
       if(data==null)
{
   throw new Error("Accounts Does Not Exists")

}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }

async deleteAccount(settingsConfig,accountId){
    const t= await startTransaction() 
    try {
        const logger = settingsConfig.logger;
        logger.info(`[Account_SERVICE] : Inside deleteAccount`);

        const deleteAccounts=await accountConfig.model.destroy({where:{id:accountId},transaction:t})
      
        t.commit()
        return deleteAccounts
    } catch (error) {
        t.rollback()
        throw error
    }


}


    async getAccount(settingsConfig,queryParams,payload){
        const t= await startTransaction() 
        try {
        const logger = settingsConfig.logger;
        logger.info(`[Account_SERVICE] : Inside getAccount`);
        validateUuid(queryParams.accountNo)
        const data=await accountConfig.model.findOne({...parseFilterQueries(queryParams,accountConfig.filter,{[accountConfig.fieldMapping.id]:queryParams.accountNo})})
       if(data==null) {
   throw new Error("Account Does Not Exists With Given Account Number")

}     
        if(payload.id!=data.userId){
            throw new Error("You Cannot Access Others Accounts")
        }

   console.log(payload.id)
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async withdrawAmount(settingsConfig,newaccountNumber,amount,queryParams,flag,senderAccountNo,recevierAccountNo){
        const t= await startTransaction() 
        try {
        const logger = settingsConfig.logger;
        logger.info(`[Account_SERVICE] : Inside withdrawAmount`);
        console.log(newaccountNumber,amount);
        const data=await accountConfig.model.findOne({...parseFilterQueries(queryParams,accountConfig.filter,{[accountConfig.fieldMapping.id]:newaccountNumber})})

        if(data==null) {
   throw new Error("Account Does Not Exists With Given Account Number")

} 
const newBalance=data.balance-amount;
if(newBalance<1000){
    throw new Error("You Cannot Withdraw Money Because You Have Reached The Minimum Maintaince Amount") 
}
  await accountConfig.model.update({[accountConfig.fieldMapping.balance]:newBalance},{...parseFilterQueries(queryParams,accountConfig.filter,{[accountConfig.fieldMapping.id]:newaccountNumber})})  
  const date= new Date()
  let transaction
  if(flag==true){
    transaction={
        id:v4(),
        date:date.toLocaleDateString(),
        recevierAccountno:recevierAccountNo,
        amount:amount,
        currentBalance:newBalance,
        type:"transfer",
        accountId:newaccountNumber
    }
  }
  else{
    transaction={
        id:v4(),
        date:date.toLocaleDateString(),
        senderAccountno:newaccountNumber,
        amount:amount,
        currentBalance:newBalance,
        type:"withdraw",
        accountId:newaccountNumber
    }
  }

await transactionConfig.model.create(transaction,{transaction:t})

 
        t.commit()
        return `Amount WithDrawn From Account ${newaccountNumber}`
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async depositAmount(settingsConfig,newaccountNumber,amount,queryParams,flag,senderAccountNo,recevierAccountNo){
        const t= await startTransaction() 
        try {
        const logger = settingsConfig.logger;
        logger.info(`[Account_SERVICE] : Inside depositAmount`);
        const date=new Date()
      
        console.log(newaccountNumber,amount);
        const data=await accountConfig.model.findOne({...parseFilterQueries(queryParams,accountConfig.filter,{[accountConfig.fieldMapping.id]:newaccountNumber})})
        const currentBalance=data.balance+amount
        let transaction
        if(flag==true){
            transaction={
                id:v4(),
                date:date.toLocaleDateString(),
                senderAccountno:senderAccountNo,
                amount:amount,
                currentBalance:currentBalance,
                type:"transfer",
                accountId:newaccountNumber
            }
          }
          else{
            transaction={
                id:v4(),
                date:date.toLocaleDateString(),
                senderAccountno:newaccountNumber,
                amount:amount,
                currentBalance:currentBalance,
                type:"Deposite",
                accountId:newaccountNumber
            }
          }
        if(data==null) {
   throw new Error("Account Does Not Exists With Given Account Number")

} 
const newBalance=data.balance+amount;

  await accountConfig.model.update({[accountConfig.fieldMapping.balance]:newBalance},{...parseFilterQueries(queryParams,accountConfig.filter,{[accountConfig.fieldMapping.id]:newaccountNumber})})  
  await transactionConfig.model.create(transaction,{transaction:t})
 
        t.commit()
        return `Amount Deposited To Account ${newaccountNumber}`
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async transferAmount(settingsConfig,senderAccountNo,recevierAccountNo,amount,queryParams){
        const flag=true
        const t= await startTransaction() 
        try {
        const logger = settingsConfig.logger;
        logger.info(`[Account_SERVICE] : Inside transferAmount`);
    
        const sender=await accountConfig.model.findOne({...parseFilterQueries(queryParams,accountConfig.filter,{[accountConfig.fieldMapping.id]:senderAccountNo})})
        const recevier=await accountConfig.model.findOne({...parseFilterQueries(queryParams,accountConfig.filter,{[accountConfig.fieldMapping.id]:recevierAccountNo})})
       
        if(sender==null||recevier==null) {
   throw new Error("Account Does Not Exists With Given Account Number")

} 

   await this.withdrawAmount(settingsConfig,senderAccountNo,amount,queryParams,true,senderAccountNo,recevierAccountNo)
   await this.depositAmount(settingsConfig,recevierAccountNo,amount,queryParams,true,senderAccountNo,recevierAccountNo)

 
        t.commit()
        return `Amount Transfered From ${senderAccountNo} To Account ${recevierAccountNo}`
        } catch (error) {
            t.rollback()
            throw error
        }
    }
 async printPassBook(settingsConfig,accountNo,queryParams){
    const t=await startTransaction()
    try {
        console.log("############################",queryParams);
       const data= await transactionConfig.model.findAndCountAll({...parseFilterQueries(queryParams,transactionConfig.filter,{[transactionConfig.fieldMapping.accountId]:accountNo}),transaction:t
    ,...parseLimitAndOffset(queryParams)
    }) 
       t.commit()
       return data
    } catch (error) {
        t.rollback()
        throw error
    }
 }


 async bankNetWorth(settingsConfig,bankId,queryParams){
    const t=await startTransaction()
    try {
       const data= await accountConfig.model.findAndCountAll({...parseFilterQueries(queryParams,accountConfig.filter,{[accountConfig.fieldMapping.bankId]:bankId}),transaction:t}) 
       t.commit()

       return data
    } catch (error) {
        t.rollback()
        throw error
    }
 }
}

const accountService=new AccountService()
module.exports=accountService