const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const account = require('../../models/account')
const { Op } = require('sequelize')

class AccountConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            bankId:"bankId",
            userId:"userId",
            bankName:"bankName",
            balance:"balance"
           
        })
        
      this.model=db.account
      this.modelName=db.account.name
      this.tableName=db.account.tableName
      this.filter=Object.freeze({
        id: (id) => {
            
            validateUuid(id)
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
          bankId: (bankId) => {
            
            validateUuid(bankId)
            return {
              [this.fieldMapping.bankId]: {
                [Op.eq]: bankId,
              },
            };
          },
          userId: (userId) => {
            
            validateUuid(userId)
            return {
              [this.fieldMapping.userId]: {
                [Op.eq]: userId,
              },
            };
          },
        bankName: (bankName) => {
            
            return {
              [this.fieldMapping.bankName]: {
                [Op.like]: `%${bankName}%`,
              },
            };
          },
          balance: (balance) => {
            return {
              [this.fieldMapping.balance]: {
                [Op.eq]: balance,
              },
            };
          },
          
          
      })
    }
    validateAccount(Account){
        try {
          validateUuid(Account.bankId)
          this.validateAccountBalance(Account.balance)
            
        } catch (error) {
            throw error
        }
    
      }
  
      validateAccountBalance(balance){
    try{
     if(typeof balance!="number"){
      throw new Error("Invalid Balance")
     }
    }
    catch(error){
     throw error
    }
   }
  
}
const accountConfig=new AccountConfig()
module.exports=accountConfig