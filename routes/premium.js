const express = require('express');
const router = express.Router();
const { showLeaderboard } = require('../controllers/premium'); 

router.get('/premium/showleaderboard', showLeaderboard);

module.exports = router;