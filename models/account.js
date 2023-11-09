'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    account.belongsTo(models.user,{foreignKey:'user_id',as:'user' })

      // define association here
    }
  }
  account.init({
    bankId: DataTypes.STRING,
    bankName: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    userId:DataTypes.UUID
  }, {
    sequelize,
    modelName: 'account',
    underscored: true,
    paranoid:true,
  });
  return account;
};