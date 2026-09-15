const express = require('express');
const { methodNotAllowed } = require('../middleware/methodNotAllowed');
const { success } = require('../utils/responses');

const router = express.Router();

// Kleiner Check: Läuft die API?
router.get('/', (req, res) => {
  return success(res, 200, {
    status: 'ok'
  });
});

router.all('/', methodNotAllowed(['GET']));

module.exports = router;
