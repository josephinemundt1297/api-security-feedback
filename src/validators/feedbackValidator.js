// Hier checken wir: Sind die Daten okay oder komisch?
function validateFeedback(body) {
  const details = [];
  const allowedFields = ['name', 'email', 'message'];

  // Der Body muss ein normales Objekt sein, keine Liste und kein Quatsch.
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Request-Body muss ein JSON-Objekt sein.'];
  }

  // Extra-Felder wollen wir nicht, sonst könnte jemand Mist mitschicken.
  const unexpectedFields = Object.keys(body).filter((field) => !allowedFields.includes(field));
  if (unexpectedFields.length > 0) {
    details.push(`Unerwartete Felder: ${unexpectedFields.join(', ')}`);
  }

  // Alle drei Felder müssen Text sein.
  for (const field of allowedFields) {
    if (typeof body[field] !== 'string') {
      details.push(`${field} muss als String vorhanden sein.`);
    }
  }

  if (typeof body.name === 'string') {
    // trim() nimmt Leerzeichen vorne und hinten weg.
    const name = body.name.trim();
    if (name.length === 0) {
      details.push('name darf nicht leer sein.');
    }
    if (name.length > 80) {
      details.push('name darf maximal 80 Zeichen lang sein.');
    }
  }

  if (typeof body.email === 'string') {
    const email = body.email.trim();
    // Das ist kein perfekter Mail-Check, aber gut genug für diese Übung.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) {
      details.push('email darf nicht leer sein.');
    } else if (!emailPattern.test(email)) {
      details.push('email muss ein plausibles Format haben.');
    }
    if (email.length > 120) {
      details.push('email darf maximal 120 Zeichen lang sein.');
    }
  }

  if (typeof body.message === 'string') {
    const message = body.message.trim();
    if (message.length < 10) {
      details.push('message muss mindestens 10 Zeichen lang sein.');
    }
    if (message.length > 1000) {
      details.push('message darf maximal 1000 Zeichen lang sein.');
    }
  }

  return details;
}

module.exports = {
  validateFeedback
};
