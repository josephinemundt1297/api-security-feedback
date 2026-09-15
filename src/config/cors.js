const cors = require('cors');

// Diese Origin darf aus dem Browser auf unsere API zugreifen.
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
const allowedMethods = ['GET', 'POST', 'OPTIONS'];
const allowedHeaders = ['Content-Type'];

const corsMiddleware = cors({
  origin(origin, callback) {
    // Manche Tools senden keine Origin. Das ist hier okay.
    callback(null, !origin || origin === allowedOrigin);
  },
  methods: allowedMethods,
  allowedHeaders,
  optionsSuccessStatus: 204,
  maxAge: 600
});

module.exports = {
  allowedOrigin,
  corsMiddleware
};
