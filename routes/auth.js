const express = require('express');
const router = express.Router();
const {  getExp, addExp, delExp, editExp } = require('../controllers/expense');
const { authenticate } = require('../middlewares/auth');


router.get('/expenses', authenticate, getExp);
router.post('/expenses', authenticate, addExp);
router.delete('/expenses/:id', authenticate, delExp);
router.put('/expenses/:id', authenticate, editExp);

module.exports = router;
