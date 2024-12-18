const Sequelize = require('sequelize');
const sequelize = require('../util/databases');
const User = require('./User'); 

const Expense = sequelize.define('expensetable', {
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    totalexpense: {
        type : Sequelize.INTEGER ,
        allowNull : true , 
    }, 
    userId: { 
        type: Sequelize.INTEGER,
        references: {
            model: User,  
            key: 'id' 
        },
        allowNull: false,
        onDelete: 'CASCADE',  
        onUpdate: 'CASCADE',  
    }
}, {
    tableName: 'expensetable',
    timestamps: true
});

module.exports = Expense;
