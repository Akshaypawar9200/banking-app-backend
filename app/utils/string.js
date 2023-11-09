const { BadRequest } = require("throw.js");

const isEmptyString = (str) => {
    if (!isString(str)) {
        return true
    }
    if (!str || str.trim() === "") {
        return true;
    }
    return false
}

const trimSpaceFromObject = (obj, fieldArray) => {
    if (!obj || !fieldArray) {
        return
    }
    if (!Array.isArray(fieldArray)) {
        fieldArray = [fieldArray]
    }
    for (let i = 0; i < fieldArray.length; i++) {
        for (const field of fieldArray) {

            if (!obj[field]) {
                continue
            }

            if (!isString(obj[field])) {
                throw new Error(`${obj[field]}: is not a valid string`)
            }
            obj[field] = obj[field].trim();
        }
    }
}

const isString = (str) => {
    return Object.prototype.toString.call(str) === "[object String]"
}

const isNonEmptyString = (str) => {
    if (!isString(str)) {
        return false
    }
    return !isEmptyString(str)
}

const validateStringLength = (str, entityName, minLength, maxLength) => {
    if (isEmptyString(str)) {
        return
    }
    const length = str.length
    if (minLength && maxLength && (length < minLength || length > maxLength)) {
        throw new BadRequest(`${entityName} should consist of ${minLength}-${maxLength} characters`)
    }
    if (minLength && length < minLength) {
        throw new BadRequest(`${entityName} should have atleast ${minLength} characters`)
    }
    if (maxLength && length > maxLength) {
        throw new BadRequest(`${entityName} cannot have more than ${maxLength} characters`)
    }
}


module.exports = {
    isEmptyString, isString, isNonEmptyString,
    trimSpaceFromObject, validateStringLength
}