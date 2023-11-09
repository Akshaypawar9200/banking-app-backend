const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class TransactionConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            createdAt:"createdAt",
            date:"date",
            senderAccountno:"senderAccountno",
            recevierAccountno:"recevierAccountno", 
            amount:"amount",
            currentBalance:"currentBalance",
            type:"type",
            accountId:"accountId",
         
        })
        this.association=Object.freeze({
          transactionFilter:'transactionFilter',
      })    
      this.model=db.transaction
      this.modelName=db.transaction.name
      this.tableName=db.transaction.tableName
      this.filter=Object.freeze({
        fromDate: (val) => {
                
          return {
          [this.fieldMapping.createdAt]: {
              [Op.gte]: new Date(val)
          }
      }
      },
      toDate: val => {
        
           return {
      [this.fieldMapping.createdAt]: {
       [Op.lte]: new Date(val)
      }
           }},
        id: (id) => {
            
            validateUuid(id)
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
        date: (date) => {
            
            return {
              [this.fieldMapping.date]: {
                [Op.like]: `%${date}%`,
              
              },
            };
          },
          senderAccountno: (senderAccountno) => {
            return {
              [this.fieldMapping.senderAccountno]: {
                [Op.eq]: senderAccountno,
              },
            };
          },
          recevierAccountno: (recevierAccountno) => {
            return {
              [this.fieldMapping.recevierAccountno]: {
                [Op.eq]: recevierAccountno,
              },
            };
          },
          amount: (amount) => {
            return {
              [this.fieldMapping.amount]: {
                [Op.eq]: amount,
              },
            };
          },
          currentBalance: (currentBalance) => {
            return {
              [this.fieldMapping.currentBalance]: {
                [Op.eq]: currentBalance,
              },
            };
          },
          type: (type) => {
            
            return {
             
              [this.fieldMapping.type]: {
                [Op.like]: `%${type}%`,
              },
            };
          },
          accountId: (accountId) => {
            return {
              [this.fieldMapping.accountId]: {
                [Op.eq]: accountId,
              },
            };
          },
         
      })
    }

}
const transactionConfig=new TransactionConfig()
module.exports=transactionConfig