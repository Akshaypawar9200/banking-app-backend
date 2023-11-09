// const userConfig = require("../model-config/user-config");
const { StatusCodes } = require("http-status-codes")
const { validateUuid } = require("../utils/uuid");


const roleBasedQueryInjector = async (settingsConfig, req, res, next) => {
  const logger = settingsConfig.logger;
  logger.info(`[CHECK_PROSPECT_MIDDLEWARE] : Inside roleBasedQueryInjector middleware`);

  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - Invalid token" });
  }

  try {
    const userId = req.user.id
    validateUuid(userId)
    // const user = await _getUser(userId)

    // if (!user.roles) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({ message: "Role not found for current user" });
    // }

    // if (!user.roles.includes(USER_ROLES.ADMIN)) {
    //   req.query.userId = userId
    // }

    logger.info(`[CHECK_PROSPECT_MIDDLEWARE] : End of roleBasedQueryInjector middleware`);
    next()
  } catch (error) {
    logger.error(`[CHECK_PROSPECT_MIDDLEWARE] : ERROR : ${error.message}`);
    logger.error(error)
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - Invalid token" });
  }
}

const _getUser = async (userId) => {
  // should transaction be used here?
  return await userConfig.model.findByPk(userId, {
    attributes: [userConfig.fieldMapping.id, userConfig.fieldMapping.roles]
  })
}

module.exports = { roleBasedQueryInjector }