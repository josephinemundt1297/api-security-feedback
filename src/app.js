const express = require('express');
const cors = require('cors');

const app = express();

// Hier merken wir uns Feedback nur kurz im Arbeitsspeicher.
const feedbackEntries = [];
let nextId = 1;

// Diese Origin darf aus dem Browser auf unsere API zugreifen.
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
const allowedMethods = ['GET', 'POST', 'OPTIONS'];
const allowedHeaders = ['Content-Type'];

// Damit verraten wir nicht direkt: "Hey, ich bin Express!".
app.disable('x-powered-by');

// CORS ist wie eine Tuerliste fuer Browser-Anfragen.
app.use(cors({
  origin(origin, callback) {
    // Ohne Origin ist z. B. curl. Die erlauben wir hier.
    callback(null, !origin || origin === allowedOrigin);
  },
  methods: allowedMethods,
  allowedHeaders,
  optionsSuccessStatus: 204,
  maxAge: 600
}));

// JSON darf nur klein sein, damit niemand riesige Bodies schickt.
app.use(express.json({
  limit: '10kb',
  type: 'application/json'
}));

// So sehen gute Antworten immer gleich aus.
function success(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

// So sehen Fehler immer gleich aus.
function failure(res, statusCode, error, details = []) {
  return res.status(statusCode).json({
    success: false,
    error,
    details
  });
}

// Hier geben wir nur raus, was andere wirklich sehen sollen.
function publicFeedback(entry) {
  return {
    id: entry.id,
    name: entry.name,
    email: entry.email,
    message: entry.message,
    createdAt: entry.createdAt
  };
}

// Hier checken wir: Sind die Daten okay oder komisch?
function validateFeedback(body) {
  const details = [];
  const allowedFields = ['name', 'email', 'message'];

  // Der Body muss ein normales Objekt sein, keine Liste und kein Quatsch.
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Request-Body muss ein JSON-Objekt sein.'];
  }

  // Extra-Felder wollen wir nicht, sonst koennte jemand Mist mitschicken.
  const unexpectedFields = Object.keys(body).filter((field) => !allowedFields.includes(field));
  if (unexpectedFields.length > 0) {
    details.push(`Unerwartete Felder: ${unexpectedFields.join(', ')}`);
  }

  // Alle drei Felder muessen Text sein.
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
    // Das ist kein perfekter Mail-Check, aber gut genug fuer diese Uebung.
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

// Wenn jemand DELETE oder PATCH probiert, sagen wir klar: geht nicht.
function methodNotAllowed(allowed) {
  return (req, res) => {
    res.set('Allow', allowed.join(', '));
    return failure(res, 405, 'Methode nicht erlaubt', [
      `Erlaubte Methoden: ${allowed.join(', ')}`
    ]);
  };
}

// Kleiner Check: Laeuft die API?
app.get('/health', (req, res) => {
  return success(res, 200, {
    status: 'ok'
  });
});

app.all('/health', methodNotAllowed(['GET']));

app.get('/api/feedback', (req, res) => {
  // Beim Lesen zeigen wir nur die sicheren Feedback-Felder.
  return success(res, 200, feedbackEntries.map(publicFeedback));
});

app.post('/api/feedback', (req, res) => {
  // Wir wollen hier wirklich JSON bekommen.
  if (!req.is('application/json')) {
    return failure(res, 415, 'Unsupported Media Type', [
      'Content-Type muss application/json sein.'
    ]);
  }

  const details = validateFeedback(req.body);
  // Wenn etwas falsch ist, speichern wir nichts.
  if (details.length > 0) {
    return failure(res, 400, 'Ungueltige Eingabedaten', details);
  }

  // Jetzt bauen wir den sauberen Feedback-Eintrag.
  const entry = {
    id: nextId,
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    message: req.body.message.trim(),
    createdAt: new Date().toISOString(),
    // Intern okay, aber das schicken wir nicht an den Client zurueck.
    internalSource: req.ip
  };
  nextId += 1;
  feedbackEntries.push(entry);

  return success(res, 201, publicFeedback(entry));
});

app.all('/api/feedback', methodNotAllowed(['GET', 'POST']));

// Alles, was es nicht gibt, bekommt eine JSON-404-Antwort.
app.use((req, res) => {
  return failure(res, 404, 'Route nicht gefunden', [
    'Dieser Pfad ist in der API nicht vorgesehen.'
  ]);
});

// Letztes Sicherheitsnetz fuer unerwartete Fehler.
app.use((err, req, res, next) => {
  // Kaputtes JSON ist ein Client-Fehler, kein Server-Geheimnis.
  if (err instanceof SyntaxError && 'body' in err) {
    return failure(res, 400, 'Ungueltiges JSON', [
      'Der Request-Body konnte nicht als JSON gelesen werden.'
    ]);
  }

  // Details loggen wir nur im Server, nicht in der Antwort.
  console.error(err);
  return failure(res, 500, 'Interner Serverfehler', [
    'Die Anfrage konnte nicht verarbeitet werden.'
  ]);
});

module.exports = {
  app,
  allowedOrigin,
  feedbackEntries
};
