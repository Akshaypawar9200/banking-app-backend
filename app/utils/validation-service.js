const _ = require('lodash');
const { BadRequest } = require("throw.js");

// const permissions = require('../../config/settings/permissions.json');

class ValidationService {

  isEmpty(obj) {
    return _.isEmpty(obj);
  }

  getMissingKeys(validationObj, requiredKeys) {
    const existingKeys = Object.keys(validationObj);
    return _.difference(requiredKeys, existingKeys);
  }

  removeNullKeysInObj(validationObj) {
    const newObject = _.omitBy(validationObj, _.isNil);
    return newObject;
  }

  getCleanObject(obj) {
    return _.omitBy(_.mapValues(obj, (value) => {
      if (typeof value === 'string') {
        return value.trim(); // Trim string values
      }
      if (typeof value === 'object' && value !== null) {
        return cleanObject(value); // Recursively clean nested objects
      }
      return value; // Keep other values unchanged
    }), _.isNull); // Remove properties with null values
  }

  processMissingKeys(arrayOfStrings) {
    if (!Array.isArray(arrayOfStrings) || arrayOfStrings.length === 0) {
      return;
    }

    if (arrayOfStrings.length === 1) {
      throw new BadRequest(`${arrayOfStrings[0]} is required`)
    }

    let errMsg = '';
    for (let i = 0; i < arrayOfStrings.length; i++) {
      if (i === arrayOfStrings.length - 1) {
        errMsg += `and ${arrayOfStrings[i]} are required`;
      } else if (i === arrayOfStrings.length - 2) {
        errMsg += arrayOfStrings[i] + ' ';
      } else {
        errMsg += arrayOfStrings[i] + ', ';
      }
    }
    throw new BadRequest(errMsg)
  }



  // checkPermissions(userPermission, type) {
  //   const requiredPermission = [].concat(permissions[type]);
  //   if (!requiredPermission.every((elem) => userPermission.indexOf(elem) > -1)) {
  //     return false;
  //   }
  //   return true;
  // }
}

module.exports = ValidationService;
