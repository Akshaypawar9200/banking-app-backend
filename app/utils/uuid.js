const uuid = require("uuid")
const { isEmptyString } = require("./string")
const errors = require("throw.js");


// throws an error in case of invalid uuid.
const validateUuid = (id, entityName) => {
    const idString = isEmptyString(entityName) ? "uuid" : entityName + " id"
    if (!uuid.validate(id)) {
        throw new errors.BadRequest(`${idString} is invalid`)
    }
}

// throws an error in case of invalid uuid.
const validateUuidInArray = (idArray, entityName) => {
    const idString = isEmptyString(entityName) ? "uuid" : entityName + " id"
    if (!Array.isArray(idArray)) {
        idArray = [idArray]
    }
    for (let i = 0; i < idArray.length; i++) {
        if (!uuid.validate(idArray[i])) {
            throw new errors.BadRequest(`Index:${i} - ${idArray[i]}: ${idString} is invalid`)
        }
    }
}

// returns true if uuid is valid
const isUuidValid = (id) => {
    return uuid.validate(id)
}

module.exports = { validateUuid, isUuidValid, validateUuidInArray }