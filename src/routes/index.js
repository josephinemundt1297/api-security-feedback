const express = require('express');
const apiRoutes = require('./api');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

// Erst normale Routen, dann darunter die API-Routen.
router.use('/health', healthRoutes);
router.use('/api', apiRoutes);

module.exports = router;
