const express = require('express');
const router = express.Router();
const { AddUser, LoginUser } = require('../controllers/UserDetail');

router.post('/signup', AddUser);
router.post('/login', LoginUser);

module.exports = router;
