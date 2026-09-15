const express = require('express');
const { getAllFeedback, createFeedback } = require('../../controllers/feedbackController');
const { methodNotAllowed } = require('../../middleware/methodNotAllowed');
const { requireJson } = require('../../middleware/requireJson');

const router = express.Router();

router.get('/', getAllFeedback);
router.post('/', requireJson, createFeedback);
router.all('/', methodNotAllowed(['GET', 'POST']));

module.exports = router;
