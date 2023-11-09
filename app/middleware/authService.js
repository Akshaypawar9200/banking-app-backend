const jsonwebtoken = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { log } = require("winston");
require("dotenv").config();
function checkJwtHS256(settingsConfig, req, res, next) {
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside checkJWTHS256`);
  
    const secretKey = process.env.AUTH_CLIENT_SECRET;

    let token=req?.headers[process.env.AUTH_CLIENT_NAME]
   
    if (!token) {
      token=req.cookies[process.env.AUTH_CLIENT_NAME]
    }

    return jsonwebtoken.verify(token, secretKey);
  } catch (error) {
    throw error;
  }
}


function isAdmin(settingsConfig, req, res, next){
try {
  const logger = settingsConfig.logger;
  logger.info(`[AUTH_SERVICE] : Inside IsAdmin`);
  const payload= checkJwtHS256(settingsConfig, req, res, next)
if(!payload.isAdmin){
 throw new Error("You are Not Admin") 
}
next()
} catch (error) {
  next(error)
}
}
function isUser(settingsConfig, req, res, next){
  try {
    const logger = settingsConfig.logger;
    logger.info(`[AUTH_SERVICE] : Inside IsUser`);
    const payload= checkJwtHS256(settingsConfig, req, res, next)
  if(payload.isAdmin){
   throw new Error("You are Not User") 
  }
  next()
  } catch (error) {
    next(error)
  }
  }
  function tokencreation(payload){
    const token=jsonwebtoken.sign(JSON.stringify(payload),process.env.AUTH_CLIENT_SECRET)
    return token
  
  }
module.exports = {
  checkJwtHS256,
  isAdmin,
  isUser,
  tokencreation
};




