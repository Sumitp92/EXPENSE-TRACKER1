const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const compression = require('compression');
const sequelize = require('./model/expenses');
const Auth = require('./model/User');
const path = require('path');
const ass = require('./model/assocation');
const ordder = require('./model/order');
const download = require('./model/download');
const generalRoutes = require('./routes/router');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const forgotpassRoutes = require('./routes/forgotpass');
const DownloadFile = require('./routes/downloadfiles');

const app = express();

// Middleware setup
app.use( helmet({ contentSecurityPolicy: false }) )
app.use(compression());
app.use(morgan('combined', { stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Use built-in middleware for JSON parsing
app.use(express.urlencoded({ extended: true })); // For URL-encoded data

// Route setup
app.use('/password', forgotpassRoutes); // for forgot/update password
app.use('/api', generalRoutes); // For general APIs
app.use('/purchase', purchaseRoutes); // For purchase-related routes
app.use('/api', premiumRoutes); // For premium routes
app.use('/api/expenses', DownloadFile); // for download files

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Sync database and start server
sequelize.sync({ force: false })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });