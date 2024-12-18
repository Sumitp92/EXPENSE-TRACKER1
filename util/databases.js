const Sequelize = require('sequelize') 

//  const sequelize = new Sequelize(process.env.DB_NAME , process.env.DB_ROOT , process.env.DB_PASS, {
//      dialect :'mysql',
//      host: process.env.DB_HOST,
//     });
    
// module.exports = sequelize;

 const sequelize = new Sequelize('expensetracker' , 'root' , '876722', {
        dialect :'mysql',
        host: 'localhost'
        });

        module.exports = sequelize;