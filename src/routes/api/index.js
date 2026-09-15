const express = require('express');
const feedbackRoutes = require('./feedbackRoutes');

const router = express.Router();

// Verschachtelte Route: /api + /feedback = /api/feedback
router.use('/feedback', feedbackRoutes);

module.exports = router;
