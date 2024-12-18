const Sequelize = require('sequelize');
const path = require('path');
const expenseRecord = require('../model/expenses');
const sequelize = require('../util/databases'); 
require('dotenv').config();

// Add Expense
const addExp = async (req, res) => {
    try {
        const { amount, description, category } = req.body;

        const userExpenses = await expenseRecord.findAll({ where: { userId: req.user.id } });
          
          let totalExpense = 0; //Calculate total of old expenses
          for (let i = 0; i < userExpenses.length; i++) {
              totalExpense += userExpenses[i].amount;
          }
          totalExpense += parseFloat(amount);

        const expense = await expenseRecord.create({
             amount, description,
              category, userId: req.user.id, 
              totalexpense: totalExpense 
            });
        res.status(201).json({ success: true, expense , message : "Expense Added" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding expense", error: error.message });
    }
};


// Delete Expense
const delExp = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await expenseRecord.findOne({ where: { id, userId: req.user.id } });
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
        const expenses = await expenseRecord.findAll({ where: { userId } });

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