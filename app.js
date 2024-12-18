const Sequelize = require('sequelize');
const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const compression = require('compression');
const path = require('path');
const sequelize = require('./util/databases'); 

const app = express();

app.use( helmet({ contentSecurityPolicy: false }) )
app.use(compression());
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


const generalRoutes = require('./routes/router');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const forgotpassRoutes = require('./routes/forgotpass');
const expeRoutes = require('./routes/auth');
const DownloadFile = require('./routes/downloadfiles');

app.use('/password', forgotpassRoutes); // for forgot/update password
app.use('/api', generalRoutes , expeRoutes); // For general APIs
app.use('/purchase', purchaseRoutes); // For purchase-related routes
app.use('/api', premiumRoutes); // For premium routes
app.use('/api/expenses', DownloadFile); // for download files



const Expense = require('./model/expenses');
const User = require('./model/User');
const ForgotPasswordRequests = require('./model/ForgotPasswordRequests');
const Order = require('./model/order');
const Download = require('./model/download');

User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ForgotPasswordRequests, { foreignKey: 'userId' });
ForgotPasswordRequests.belongsTo(User, { foreignKey: 'userId' });


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


sequelize.sync({ force: false })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });