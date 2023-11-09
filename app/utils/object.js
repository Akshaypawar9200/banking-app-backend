function deepFreeze(obj) {
    // First freeze the top-level object
    Object.freeze(obj);

    // Iterate through object's properties
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
        }
    }

    return obj;
}

module.exports = { deepFreeze }