const { app, allowedOrigin } = require('./app');

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`Feedback API laeuft auf http://localhost:${port}`);
  console.log(`Erlaubte CORS-Origin: ${allowedOrigin}`);
});
