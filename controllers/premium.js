const Sequelize = require('sequelize');
const path = require('path');
const Order = require('../model/order');
const expenseRecord = require('../model/expenses');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const sequelize = require('../util/databases'); 

//below code is for premium user 
const buyPremium = async (req, res) => {

    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const amount = 50000; 
        const razorpayOrder = await rzp.orders.create({
            amount,
            currency: 'INR',
            receipt: `order_rcptid_${Date.now()}`,
        });
        if (!razorpayOrder) throw new Error('Failed to create Razorpay order');
        res.status(201).json({
            key_id: process.env.RAZORPAY_KEY_ID,
            order: razorpayOrder,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error.message);
        // res.status(500).json({ error: 'Error creating Razorpay order' });
    }
};


const updatePremiumStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        if (!payment_id || !order_id) {
            return res.status(400).json({ error: 'Invalid request payload' });
        }
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const paymentVerification = await rzp.payments.fetch(payment_id);
        // console.log('Payment verification response:', paymentVerification);

        if (!paymentVerification || paymentVerification.status !== 'captured') {
            return res.status(400).json({ error: 'invalid payment ID' });
        }
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.isPremium = true;
        await user.save();
        const newOrder = await Order.create({
            orderId: order_id,
            paymentId: payment_id,
            status: 'success',
            userId: user.id,
        });
        const token = jwt.sign(
            { userId: user.id, isPremium: user.isPremium }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        console.log('Updated user:', user);
        res.status(200).json({ message: 'Transaction successful', token, order: newOrder });
    } catch (error) {
        console.error('Error updating premium status:', error.message);
        res.status(500).json({ error: 'Error updating premium status' });
    }
};


//below code is for premiumFeatures
  const showLeaderboard = async (req, res) => {
    try {
      const leaderboardData = await expenseRecord.findAll({
        attributes: [
          'userId',
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpense'],
        ],
        group: ['userId', 'user.id'], 
        order: [[sequelize.literal('totalExpense'), 'DESC']],
        include: {
          model: User, 
          as: 'user', 
          attributes: ['name'], 
        },
      });
      const formattedLeaderboard = leaderboardData.map((record) => ({
        userName: record.user ? record.user.name : 'Unknown User',
        totalExpense: record.getDataValue('totalExpense'),
      }));
      res.status(200).json({ success: true, leaderboard: formattedLeaderboard });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({success: false,message: 'Error fetching leaderboard',error: error.message,});
    }
  };

  module.exports = {showLeaderboard , updatePremiumStatus , buyPremium}