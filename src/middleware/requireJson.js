const { failure } = require('../utils/responses');

function requireJson(req, res, next) {
  // Wir wollen hier wirklich JSON bekommen.
  if (!req.is('application/json')) {
    return failure(res, 415, 'Unsupported Media Type', [
      'Content-Type muss application/json sein.'
    ]);
  }

  return next();
}

module.exports = {
  requireJson
};
