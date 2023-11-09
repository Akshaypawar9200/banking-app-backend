const user = require("../../../../models/user");
const userConfig = require("../../../model-config/userConfig");
const {startTransaction}=require("../../../sequelize/transaction")
const bcrypt = require('bcrypt');
const { parseLimitAndOffset, unmarshalBody, parseSelectFields, parseFilterQueries }=require('../../../utils/request');
const { tokencreation } = require("../../../middleware/authService");
const accountConfig = require("../../../model-config/accountConfig");
const {preloadAssociations}=require('../../../sequelize/association');
const { v4 } = require("uuid");
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
      async createUser(settingsConfig, body) {
        const t = await startTransaction();
        try {
          const logger = settingsConfig.logger;
          logger.info(`[UserService] : Inside createAdmin`);
          const hashpassword = await bcrypt.hash(body.password, 12);
          body.id = v4();
          body.isAdmin = false;
          body.password = hashpassword;
          
          const data = await userConfig.model.create(body, { transaction: t });
          await t.commit();
          return data;
        } catch (error) {
          await t.rollback();
          throw error;
        }
      }
    
    async createAdmin(settingsConfig, body) {
        const t = await startTransaction();
        try {
          const logger = settingsConfig.logger;
          logger.info(`[UserService] : Inside createAdmin`);
          const hashpassword = await bcrypt.hash(body.password, 12);
          body.id = v4();
          body.isAdmin = true;
          body.password = hashpassword;
          
          const data = await userConfig.model.create(body, { transaction: t });
          await t.commit();
          return data;
        } catch (error) {
          await t.rollback();
          throw error;
        }
      }
      
  async verifyUser(settingsConfig, payload, username) {
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside verifyUser`);
      return payload.username === username;
    } catch (error) {
      throw error;
    }
  }
  async checkingPassword(settingsConfig,username,oldPassword,newPassword){
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside checkingPassword`);
  
  
      const user=await this.getUserByUsername(settingsConfig,username)

      let result = await bcrypt.compare(oldPassword,await user[0].dataValues.password);
    
      if (!result) {
        throw new Error("invalid password");
      }
      const hashpassword = await bcrypt.hash(newPassword, 12);
      let updatePassword=await userConfig.model.update({password:hashpassword},{where:{id:await user[0].dataValues.id},transaction: t,})
      t.commit()
      return updatePassword
    } catch (error) {
      t.rollback()
      throw error
    }
  }

  async resetpass(settingsConfig,username,newPassword){
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside resetpass`);

      // const findUser=await this.getUserByUsername(settingsConfig,username)
      const hashpassword = await bcrypt.hash(newPassword, 12);
      const updatePassword=await userConfig.model.update({password:hashpassword},{where:{username:username},   transaction: t,})
      await t.commit();
      return updatePassword
    } catch (error) {
      await t.rollback();
        throw error;
    }
  }
      async getUserByUsername(settingsConfig, username) {
        const t = await startTransaction();
        try {
          const logger = settingsConfig.logger;
          logger.info(`[UserService] : Inside getUserByUsername`);
          const data = await userConfig.model.findAll({
            where: { username: username },
            paranoid:false,
            transaction: t,
          });
          await t.commit();
          return data;
        } catch (error) {
          await t.rollback();
          throw error;
        }
      }
    
    async deleteUser(settingsConfig,userId,queryParams){
        const t= await startTransaction() 
        try {
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside deleteUser`);
        const userExitence=await this.getUser(settingsConfig,userId,queryParams)
        console.log(userExitence);
       if(userExitence==null)
{
   throw new Error("User Does Not Exists")

}       
   const data= await userConfig.model.destroy({where:{id:userId}})
        t.commit()
        return data
        } catch (error) {
            t.rollback()
            throw error
        }
    }
    async getAllUser(settingsConfig,queryParams){
        const t= await startTransaction() 
        console.log(queryParams );
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
    async getUser(settingsConfig,userId,queryParams){
        const t= await startTransaction() 
        try {
            const attributeToReturn={
                id:userConfig.fieldMapping.id,
                name:userConfig.fieldMapping.name,
                age:userConfig.fieldMapping.age,
                gender:userConfig.fieldMapping.gender,
                isAdmin:userConfig.fieldMapping.isAdmin
                
            }
            // const attributeToReturn=Object.values(selectArray)
            let selectArray = parseSelectFields(queryParams, attributeToReturn);

            if (!selectArray) {
              selectArray = Object.values(attributeToReturn);
            }
        const logger = settingsConfig.logger;
        logger.info(`[USER_SERVICE] : Inside getUser`);
        const data = await userConfig.model.findOne({
            where: { id: userId },
            attributes: selectArray,
            transaction: t,
            
          });
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






async updateUser(settingsConfig, userId, body) {
    const t = await startTransaction();
    try {
      const logger = settingsConfig.logger;
      logger.info(`[UserService] : Inside updateUser`);
      let userToBeUpdate = await userConfig.model.update(body, {
        where: { id: userId },
        transaction: t,
      });
   
      t.commit();

      return userToBeUpdate;
   
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }


async login(settingsConfig, bodyElements,queryParams) {
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
        ...parseFilterQueries(queryParams,userConfig.filter,{[userConfig.fieldMapping.username]:username}),t
    });
    
    const result = bcrypt.compare(password, await passwordObj.password);
    console.log(await passwordObj)
   
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
      return [token,passwordObj];
    }
  } catch (error) {
    throw error;
  }
}


}

const userService=new UserService()
module.exports=userService