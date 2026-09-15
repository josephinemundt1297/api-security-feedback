const { app, allowedOrigin } = require('./app');

// Wenn PORT nicht gesetzt ist, nehmen wir einfach 4000.
const port = Number(process.env.PORT) || 4000;

// Ab hier wartet der Server auf Anfragen.
app.listen(port, () => {
  console.log(`Feedback API läuft auf http://localhost:${port}`);
  console.log(`Erlaubte CORS-Origin: ${allowedOrigin}`);
});
