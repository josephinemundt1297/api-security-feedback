const path = require('path');
const express = require('express');
const { corsMiddleware, allowedOrigin } = require('./config/cors');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandlers');

const app = express();

// Damit verraten wir nicht direkt: "Hey, ich bin Express!".
app.disable('x-powered-by');

// CORS prüft, welche Webseite unsere API nutzen darf.
app.use(corsMiddleware);

// JSON darf nur klein sein, damit niemand riesige Bodies schickt.
app.use(express.json({
  limit: '10kb',
  type: 'application/json'
}));

// Alles in public darf direkt im Browser geöffnet werden.
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Hier hängen wir alle Routen gesammelt ein.
app.use(routes);

// Alles, was es nicht gibt, bekommt eine JSON-404-Antwort.
app.use(notFoundHandler);

// Letztes Sicherheitsnetz für unerwartete Fehler.
app.use(errorHandler);

module.exports = {
  app,
  allowedOrigin
};
