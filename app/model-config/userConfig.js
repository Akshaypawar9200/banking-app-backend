const {validateUuid}=require('../utils/uuid')

const db = require("../../models")
const { validateStringLength } = require('../utils/string')
const { Op } = require('sequelize')

class UserConfig{
    constructor(){
        this.fieldMapping=Object.freeze({
            id:"id",
            name:"name",
            age:"age",
            gender:"gender", 
            username:"username",
            password:"password",
            isAdmin:"isAdmin"
        })
        this.association=Object.freeze({
          accountFilter:'accountFilter',
      })    
      this.model=db.user
      this.modelName=db.user.name
      this.tableName=db.user.tableName
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
          age: (age) => {
            return {
              [this.fieldMapping.age]: {
                [Op.eq]: age,
              },
            };
          },
          gender: (gender) => {
            return {
              [this.fieldMapping.gender]: {
                [Op.like]: `%${gender}%`,
              },
            };
          },
          
          username: (username) => {
            validateStringLength(username,"email",1,10)
            return {
             
              [this.fieldMapping.username]: {
                [Op.like]: `%${username}%`,
              },
            };
          },
          password: (password) => {
            return {
              [this.fieldMapping.password]: {
                [Op.like]: `%${password}%`,
              },
            };
          },
          isAdmin: (isAdmin) => {
            return {
              [this.fieldMapping.isAdmin]: {
                [Op.eq]: isAdmin,
              },
            };
          },
      })
    }
    validateUser(user){
        try {
          this.validateUsername(user.username)
          this.validatePassword(user.password)
          this.validateName(user.name)
          this.validateAge(user.age)
          this.validateGender(user.gender)
          this.validateIsAdmin(user.isAdmin)
            
        } catch (error) {
            throw error
        }
    
      }
   validateUsername(username){
    try{
     if(typeof username!="string"){
      throw new Error("Invalid username")
     }
    }
    catch(error){
     throw error
    }
   }
   validateName(name){
    try{
     if(typeof name!="string"){
      throw new Error("Invalid name")
     }
    }
    catch(error){
     throw error
    }
   }
   validateGender(gender){
    try{
     if(typeof gender!="string"){
      if(gender!='M'||gender!="F"){
      throw new Error("Invalid gender")
     }}
    }
    catch(error){
     throw error
    }
   }
   validateAge(age){
    try{
     if(typeof age!="number"){
      throw new Error("Invalid age")
     }
    }
    catch(error){
     throw error
    }
   }
   validatePassword(password){
    try{
     if(typeof password!="string"){
      throw new Error("Invalid password")
     }
    }
    catch(error){
     throw error
    }
   }
   validateIsAdmin(isAdmin){
    try{
     if(typeof isAdmin!="boolean"){
      throw new Error("Invalid isAdmin")
     }
    }
    catch(error){
     throw error
    }
   }
}
const userConfig=new UserConfig()
module.exports=userConfig