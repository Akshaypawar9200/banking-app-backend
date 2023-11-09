'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
  
        primaryKey: true,
        type: Sequelize.UUID
      },
      date: {
        type: Sequelize.STRING
      },
      sender_accountno: {
        type: Sequelize.UUID
      },
      recevier_accountno: {
        type: Sequelize.UUID
      },
      amount: {
        type: Sequelize.INTEGER
      },
      current_balance: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      account_id:{
        type:Sequelize.UUID,
        references:{
          model:"accounts",
          key:"id"
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};