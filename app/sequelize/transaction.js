const db = require('../../models')

const startTransaction = async () => {
    return db.sequelize.transaction()
}

module.exports = { startTransaction }