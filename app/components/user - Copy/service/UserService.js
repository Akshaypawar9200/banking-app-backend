const user = require("../../../../models/user");
const userConfig = require("../../../model-config/userConfig");
const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const accountConfig = require("../../../model-config/accountConfig");
const {preloadAssociations}=require('../../../sequelize/association')
class UserService{
    #associatiomMap = {
        account: {
          model: accountConfig.model,
          as: "account"
        },
      };
    constructor(){

    }
    createAssociation(includeQuery) {
        const association = [];
        if (Array.isArray(includeQuery)) {
          includeQuery = [includeQuery];
        }
        if (includeQuery?.includes(userConfig.association.accountFilter)) {
          association.push(this.#associatiomMap.account);
          console.log("association>>>>", association);
          return association;
        }
      }
    async createUser(settingsConfig,user){
        const t= await startTransaction() 
        try {
        
        user.password=await bcrypt.hash(user.password,12)
        const selectArray={
            id:userConfig.fieldMapping.id,
            name:userConfig.fieldMapping.name,
            age:userConfig.fieldMapping.age,
            gender:userConfig.fieldMapping.gender,
            isadmin:userConfig.fieldMapping.isAdmin
            
        }
        const attributeToReturn=Object.values(selectArray)
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside CreateUser`);
        const userExitence=await userConfig.model.findOne({...parseFilterQueries(user,userConfig.filter,{[userConfig.fieldMapping.username]:user.username})})
       if(userExitence==null)
{
    const data=await  userConfig.model.create(user,{transaction:t})
    t.commit()

    return data

}       
      throw new Error("User Exist With Same UserName,Please Use Different UserName")
        
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async deleteUser(settingsConfig,queryParams){
        const t= await startTransaction() 
        try {
    

        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside deleteUser`);
        const userExitence=await userConfig.model.findOne({...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.id})})
       if(userExitence==null)
{
   throw new Error("User Does Not Exists")

}       
   const data= await userConfig.model.destroy({...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.id})})
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async getAllUser(settingsConfig,queryParams){
        const t= await startTransaction() 
        
        try {
            const selectArray={
                id:userConfig.fieldMapping.id,
                name:userConfig.fieldMapping.name,
                age:userConfig.fieldMapping.age,
                gender:userConfig.fieldMapping.gender,
                isAdmin:userConfig.fieldMapping.isAdmin
                
            }
            const attributeToReturn=Object.values(selectArray)
            const includeQuery = queryParams.include || [];
            let association = [];
            if (queryParams.include) {
              delete queryParams.include;
            }
            if (includeQuery) {
              association = this.createAssociation(includeQuery);
              console.log("UserService",association);
            }
      
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside getAllUser`);
        const data=await userConfig.model.findAndCountAll({ transaction: t,
            ...parseFilterQueries(queryParams, userConfig.filter),
            attributes: attributeToReturn,
            ...parseLimitAndOffset(queryParams),
             ...preloadAssociations(association),  
        
        
        })
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
    async getUser(settingsConfig,queryParams){
        const t= await startTransaction() 
        try {
            const selectArray={
                id:userConfig.fieldMapping.id,
                name:userConfig.fieldMapping.name,
                age:userConfig.fieldMapping.age,
                gender:userConfig.fieldMapping.gender,
                isAdmin:userConfig.fieldMapping.isAdmin
                
            }
            const attributeToReturn=Object.values(selectArray)

        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside getUser`);
        const data=await userConfig.model.findOne({...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.id]:queryParams.userId}),attributes:attributeToReturn})
if(data==null)
        {
   throw new Error("User Does Not Exists With Given Id")

}       
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
async #updateName(settingsConfig,newValue,params){
    const t= await startTransaction() 
    
    try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside updateName`);
        await userConfig.model.update({[userConfig.fieldMapping.name]:newValue},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.username]:params.userId})})        
    } catch (error) {
        throw error
    }
}
async #updateAge(settingsConfig,newValue,params){
    const t= await startTransaction() 
    
    try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside updateAge`);
        await userConfig.model.update({[userConfig.fieldMapping.age]:newValue},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.id]:params.userId})})        

          t.commit()
    } catch (error) {
        t.rollback()
        throw error
    }
}
async #updateGender(settingsConfig,newValue,params){
    const t= await startTransaction() 
    
    try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside updateGender`);
        await userConfig.model.update({[userConfig.fieldMapping.gender]:newValue},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.id]:params.userId})})        
    } catch (error) {
        throw error
    }
}
async #updateUserName(settingsConfig,newValue,params){
    const t= await startTransaction() 
    
    try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside updateUserName`);
        
        
        const userExitence=await userConfig.model.findOne({...parseFilterQueries(user,userConfig.filter,{[userConfig.fieldMapping.username]:newValue})})
        if(userExitence==null)
 {
    await userConfig.model.update({[userConfig.fieldMapping.username]:newValue},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.id]:params.userId})})        

     t.commit()
 
     return 
 
 }       
       throw new Error("User Exist With Same UserName,Please Use Diffrent Username")
         
         } catch (error) {
             t.rollback()
             throw error
         }
        
}
async #updatePassword(settingsConfig,newValue,params){
    const t= await startTransaction() 
    
    try {
        const newPassword=await bcrypt.hash(newValue,12)
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside updatePassword`);
        await userConfig.model.update({[userConfig.fieldMapping.password]:newPassword},{...parseFilterQueries(params,userConfig.filter,{[userConfig.fieldMapping.id]:params.id})})        
    } catch (error) {
        throw error
    }
}
async updateUser(settingsConfig,parameter,newValue,params){
    const t= await startTransaction() 
try {
    const logger = settingsConfig.logger;
    logger.info(`[USER_SERVICE] : Inside updateUser`);
    switch(parameter){
        case "name":{await this.#updateName(settingsConfig,newValue,params)
        return
        }
        case "age":{await this.#updateAge(settingsConfig,newValue,params)
            return
            }
        case "gender":{await this.#updateGender(settingsConfig,newValue,params)
                return
                }   
        case "username":{await this.#updateUserName(settingsConfig,newValue,params)
            return
            } 
        case "password":{await this.#updatePassword(settingsConfig,newValue,params)
            return
            }             
        default:{throw new Error("InValid Paramter To change")}
    }
    
} catch (error) {
    t.rollback()
    throw error
}
}

async login(settingsConfig, bodyElements) {
    const t = await startTransaction();
    try {
      const { username, password } = bodyElements;

      const arrtibutesToReturn = {
        password: userConfig.fieldMapping.password,
        id: userConfig.fieldMapping.id,
        name: userConfig.fieldMapping.name,
        age: userConfig.fieldMapping.age,
        gender: userConfig.fieldMapping.gender,
        isAdmin: userConfig.fieldMapping.isAdmin,
      };
   

      const selectArray = Object.values(arrtibutesToReturn);
      const passwordObj = await userConfig.model.findOne( {
          ...parseFilterQueries(bodyElements,userConfig.filter,{[userConfig.fieldMapping.username]:username})
      });
    //   const passwordObj = await userConfig.model.findOne({
    //     ...parseFilterQueries(bodyElements, userConfig.filter, {
    //       [userConfig.fieldMapping.username]: username,
    //     }),
    //     attributes: selectArray,
    //     transaction: t,
    //   });
      const result = bcrypt.compare(password, await passwordObj.password);
      console.log(await passwordObj.password)

      if (!(await result)) {

        throw new Error("Invalid Password");
      }
      if (await result) {
        const payload = {
          id: passwordObj.id,
          username: passwordObj.username,
          isAdmin: passwordObj.isAdmin,
        };

        const token = tokencreation(payload);
        return token;
      }
    } catch (error) {
      throw error;
    }
  }

}

const userService=new UserService()
module.exports=userService