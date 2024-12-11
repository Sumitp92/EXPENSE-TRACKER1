const Sequelize = require('sequelize');
const path = require('path');
const expenseRecord = require('../model/expenses');
const sequelize = require('../util/databases'); 
require('dotenv').config();




// Add Expense
const addExp = async (req, res) => {
    try {
        const { amount, description, category } = req.body;

        if (!amount || !description || !category) {
            return res.status(400).json({ success: false, message: "Missing Expense" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const userExpenses = await expenseRecord.findAll({
            where: { userId: req.user.id },
        });

        let totalExpense = 0;
        if (userExpenses.length > 0) {
            totalExpense = userExpenses.reduce((total, expense) => total + expense.amount, 0);
        }

        totalExpense += parseFloat(amount); // Make sure amount is treated as a number
        const expense = await expenseRecord.create({
            amount,
            description,
            category,
            userId: req.user.id,
            totalexpense: totalExpense, 
        });
        res.status(201).json({ success: true, expense });
    } catch (error) {
        console.error('Error during expense addition:', error);
        res.status(500).json({ success: false, message: "Error adding expense", error: error.message });
    }
};

// Delete Expense
const delExp = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await expenseRecord.findOne({ where: { id, userId: req.user.id } });
        // if (!expense) {
        //     return res.status(404).json({ success: false, message: 'Expense not found' });
        // }
        await expense.destroy();
        res.status(200).json({ success: true, message: 'Expense deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error deleting expense' });
    }
};

// Edit Expense
const editExp = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, category } = req.body;

        const expense = await expenseRecord.findOne({ where: { id, userId: req.user.id } });

        // if (!expense) {
        //     return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
        // }

        expense.amount = amount;
        expense.description = description;
        expense.category = category;

        await expense.save();

        res.status(200).json({ success: true, expense });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error updating expense' });
    }
};

// Get Expenses
const getExp = async (req, res) => {
    try {
        const userId = req.user.id; 

        // console.log('Fetching expenses for user ID:', userId); 
        const expenses = await expenseRecord.findAll({ where: { userId } });

        // console.log('Fetched expenses:', expenses); 

        if (expenses.length === 0) {
            return res.status(404).json({ success: false, message: 'No expenses found for this user' });
        }
        res.status(200).json({ success: true, expenses }); 
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ success: false, message: 'Error fetching expenses', error: err.message });
    }
};
 

module.exports = {getExp , addExp , delExp , editExp}