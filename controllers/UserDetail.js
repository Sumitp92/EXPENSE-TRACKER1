const Sequelize = require('sequelize');
const sequelize = require('../util/databases'); 
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');


const AddUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);//number of salt round which adds randomness
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            isPremium: false, 
        });
        res.status(201).json({ success: true, message: 'User signed up successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'Error occurred during signup' });
    }
};


// Login User
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }
        const token = jwt.sign(
            { userId: user.id, isPremium: user.isPremium }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.status(200).json({ success: true, message: 'Login successful', token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isPremium: user.isPremium,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred during login' });
    }
};

module.exports = {AddUser , LoginUser}