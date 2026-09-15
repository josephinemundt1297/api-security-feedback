const express = require('express');
const cors = require('cors');

const app = express();
const feedbackEntries = [];
let nextId = 1;

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
const allowedMethods = ['GET', 'POST', 'OPTIONS'];
const allowedHeaders = ['Content-Type'];

app.disable('x-powered-by');

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || origin === allowedOrigin);
  },
  methods: allowedMethods,
  allowedHeaders,
  optionsSuccessStatus: 204,
  maxAge: 600
}));

app.use(express.json({
  limit: '10kb',
  type: 'application/json'
}));

function success(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function failure(res, statusCode, error, details = []) {
  return res.status(statusCode).json({
    success: false,
    error,
    details
  });
}

function publicFeedback(entry) {
  return {
    id: entry.id,
    name: entry.name,
    email: entry.email,
    message: entry.message,
    createdAt: entry.createdAt
  };
}

function validateFeedback(body) {
  const details = [];
  const allowedFields = ['name', 'email', 'message'];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Request-Body muss ein JSON-Objekt sein.'];
  }

  const unexpectedFields = Object.keys(body).filter((field) => !allowedFields.includes(field));
  if (unexpectedFields.length > 0) {
    details.push(`Unerwartete Felder: ${unexpectedFields.join(', ')}`);
  }

  for (const field of allowedFields) {
    if (typeof body[field] !== 'string') {
      details.push(`${field} muss als String vorhanden sein.`);
    }
  }

  if (typeof body.name === 'string') {
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

function methodNotAllowed(allowed) {
  return (req, res) => {
    res.set('Allow', allowed.join(', '));
    return failure(res, 405, 'Methode nicht erlaubt', [
      `Erlaubte Methoden: ${allowed.join(', ')}`
    ]);
  };
}

app.get('/health', (req, res) => {
  return success(res, 200, {
    status: 'ok'
  });
});

app.all('/health', methodNotAllowed(['GET']));

app.get('/api/feedback', (req, res) => {
  return success(res, 200, feedbackEntries.map(publicFeedback));
});

app.post('/api/feedback', (req, res) => {
  if (!req.is('application/json')) {
    return failure(res, 415, 'Unsupported Media Type', [
      'Content-Type muss application/json sein.'
    ]);
  }

  const details = validateFeedback(req.body);
  if (details.length > 0) {
    return failure(res, 400, 'Ungueltige Eingabedaten', details);
  }

  const entry = {
    id: nextId,
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    message: req.body.message.trim(),
    createdAt: new Date().toISOString(),
    internalSource: req.ip
  };
  nextId += 1;
  feedbackEntries.push(entry);

  return success(res, 201, publicFeedback(entry));
});

app.all('/api/feedback', methodNotAllowed(['GET', 'POST']));

app.use((req, res) => {
  return failure(res, 404, 'Route nicht gefunden', [
    'Dieser Pfad ist in der API nicht vorgesehen.'
  ]);
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return failure(res, 400, 'Ungueltiges JSON', [
      'Der Request-Body konnte nicht als JSON gelesen werden.'
    ]);
  }

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
