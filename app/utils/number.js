const isPositiveInteger = (num) => {
    if (Number.isInteger(num) && num > 0) {
        return true
    }
    return false
}

const getUniqueNumber = () => (Date.now());

module.exports = { isPositiveInteger, getUniqueNumber }