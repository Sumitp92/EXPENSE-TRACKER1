const Sequelize = require('sequelize');

// Create a new instance of Sequelize with environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_ROOT, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
});

module.exports = sequelize;
