const { failure } = require('../utils/responses');

function notFoundHandler(req, res) {
  return failure(res, 404, 'Route nicht gefunden', [
    'Dieser Pfad ist in der API nicht vorgesehen.'
  ]);
}

function errorHandler(err, req, res, next) {
  // Kaputtes JSON ist ein Client-Fehler, kein Server-Geheimnis.
  if (err instanceof SyntaxError && 'body' in err) {
    return failure(res, 400, 'Ungültiges JSON', [
      'Der Request-Body konnte nicht als JSON gelesen werden.'
    ]);
  }

  // Details loggen wir nur im Server, nicht in der Antwort.
  console.error(err);
  return failure(res, 500, 'Interner Serverfehler', [
    'Die Anfrage konnte nicht verarbeitet werden.'
  ]);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
