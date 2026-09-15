const { failure } = require('../utils/responses');

// Wenn jemand DELETE oder PATCH probiert, sagen wir klar: geht nicht.
function methodNotAllowed(allowed) {
  return (req, res) => {
    res.set('Allow', allowed.join(', '));
    return failure(res, 405, 'Methode nicht erlaubt', [
      `Erlaubte Methoden: ${allowed.join(', ')}`
    ]);
  };
}

module.exports = {
  methodNotAllowed
};
