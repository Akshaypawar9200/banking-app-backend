const { BadRequest } = require("throw.js");

const hasDuplicateValues = (array) => {
    const valueSet = new Set();
    for (const obj of array) {
        if (valueSet.has(obj.value)) {
            throw new BadRequest("Duplicate values found in the array.")
        }
        valueSet.add(obj.value);
    }
}

module.exports = { hasDuplicateValues }