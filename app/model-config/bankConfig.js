const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class BankConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            name:"name",
            abbrevation:"abbrevation",
           
        })
        
      this.model=db.bank
      this.modelName=db.bank.name
      this.tableName=db.bank.tableName
      this.filter=Object.freeze({
        id: (id) => {
            
            validateUuid(id)
            return {
              [this.fieldMapping.id]: {
                [Op.eq]: id,
              },
            };
          },
        name: (name) => {
            
            return {
              [this.fieldMapping.name]: {
                [Op.like]: `%${name}%`,
              },
            };
          },
        abbrevation: (abbrevation) => {
            return {
              [this.fieldMapping.abbrevation]: {
                [Op.like]: `%${abbrevation}%`,
              },
            };
          }
          
          
      })
    }
    validateBank(bank){
        try {
          this.validateBankName(bank.name)
            
        } catch (error) {
            throw error
        }
    
      }
  
   validateBankName(name){
    try{
     if(typeof name!="string"){
      throw new Error("Invalid name")
     }
    }
    catch(error){
     throw error
    }
   }
  
}
const bankConfig=new BankConfig()
module.exports=bankConfig