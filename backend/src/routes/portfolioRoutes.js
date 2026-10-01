const express = require('express');
const { getPortfolio, getTrades } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.use(protect);
router.get('/', getPortfolio);
router.get('/trades', getTrades);
module.exports = router;
