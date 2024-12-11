const Sequelize = require('sequelize');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 
const User = require('../model/User');
const ResetRequest = require('../model/ForgotPasswordRequests');
require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../util/databases'); 
const nodemailer = require('nodemailer'); 
  //below code is for forgot password

/// Set up the transporter using Brevo SMTP settings

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: '80b7ab001@smtp-brevo.com',
        pass: process.env.EMAIL_API_KEY,
    },
});

// Forgot Password
const forgotPassword = async (req, res) => {

    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }
        const resetId = uuidv4();
        await ResetRequest.create({
            id: resetId,
            userId: user.id,
            isActive: true,
            createdAt: new Date(),
        });
        const resetURL = `http://localhost:3000/password/resetpassword/${resetId}`;

        await transporter.sendMail({
            from: 'sumitpatil2062003@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,

        });
        res.status(200).json({ success: true, message: 'Reset link sent to your email' });
    } catch (error) {
        console.error('Error in forgot password', error);
        res.status(500).json({ success: false, message: 'Error processing request' });
    }
};


// Validate Reset Request

const validateResetRequest = async (req, res) => {
    const { resetId } = req.params;
    try {
        const resetRequest = await ResetRequest.findOne({
            where: { id: resetId, isActive: true },
        });
        if (!resetRequest) {
            return res.status(400).json({ success: false, message: 'expired reset link'});
        }
        const expirationTime = 60 * 60 * 1000; 
        const isExpired = Date.now() - new Date(resetRequest.createdAt).getTime() > expirationTime;
        if (isExpired) {
            return res.status(400).json({ success: false, message: 'Reset link has expired.' });
        }

        res.sendFile(path.join(__dirname, '../public/reset.html'));
    } catch (error) {
        console.error('Error validating reset link:', error);
        res.status(500).json({ success: false, message: 'Error validating reset link.' });
    }
};

// Reset Password

const updatePassword = async (req, res) => {
    const { resetId } = req.params;
    const { newPassword } = req.body;

    try {
        // Validate password
        if (!newPassword || newPassword.length < 2) {
            return res.status(400).json({ success: false, message: 'Password must be 2 characters long' });
        }
        const resetRequest = await ResetRequest.findOne({ where: { id: resetId, isActive: true } });
        if (!resetRequest) {
            return res.status(400).json({ success: false, message: ' expired reset link'});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findByPk(resetRequest.userId);
        
        user.password = hashedPassword;
        await user.save();
        resetRequest.isActive = false;
        await resetRequest.save();
        res.status(200).json({ success: true, message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Error updating password.' });
    }
};

module.exports = {updatePassword , forgotPassword , validateResetRequest}