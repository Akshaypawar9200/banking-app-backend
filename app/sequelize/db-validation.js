const { isString, isNonEmptyString } = require("../utils/string")
const { isUuidValid } = require("../utils/uuid")
const { NotFound } = require("throw.js");
const { Op, Sequelize } = require('sequelize');



const validateResourceExistence = async (model, id, transaction) => {
  if (!await model.count({
    where: {
      id: id
    },
    transaction: transaction
  })) {
    throw new NotFound(`${model.name} with id '${id}' doesn't exist`)
  }
}


const isFieldUnique = async (model, columnName, value, id, transaction) => {

  if (!isNonEmptyString(columnName)) {
    throw new Error(`ColumnName is not a valid string, contains:${columnName}`)
  }

  if (!isNonEmptyString(value)) {
    throw new Error(`Value is not a valid string, contains:${value}`)
  }

  let valueFilter = { [columnName]: value }
  if (isString(value)) {
    valueFilter = Sequelize.where(Sequelize.fn('lower', Sequelize.col(columnName)), value.toLowerCase())
  }

  return !(await model.count({
    where: {
      [Op.and]: [
        valueFilter,
        {
          id: {
            [Op.ne]: (isUuidValid(id) ? id : null)
          }
        }
      ]
    }
  }, { transaction: transaction }))
}

module.exports = { isFieldUnique, validateResourceExistence }