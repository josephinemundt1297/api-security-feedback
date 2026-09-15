const assert = require('node:assert/strict');
const test = require('node:test');
const { app, feedbackEntries } = require('../src/app');

function listen() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  });
}

async function request(path, options = {}) {
  const server = await listen();
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, options);
    const text = await response.text();
    return {
      response,
      body: text ? JSON.parse(text) : null
    };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('GET /health returns a standard JSON response', async () => {
  const { response, body } = await request('/health');

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-powered-by'), null);
  assert.deepEqual(body, {
    success: true,
    data: {
      status: 'ok'
    }
  });
});

test('POST /api/feedback rejects invalid input', async () => {
  const { response, body } = await request('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: ' ',
      email: 'kein-mail-format',
      message: 'kurz',
      role: 'admin'
    })
  });

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error, 'Ungueltige Eingabedaten');
  assert.ok(body.details.length >= 4);
});

test('POST /api/feedback stores valid input and returns public fields only', async () => {
  feedbackEntries.length = 0;

  const { response, body } = await request('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: ' Ada ',
      email: 'ADA@example.com',
      message: 'Das ist ein hilfreiches Feedback.'
    })
  });

  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  assert.equal(body.data.name, 'Ada');
  assert.equal(body.data.email, 'ada@example.com');
  assert.equal(body.data.internalSource, undefined);
});

test('unknown routes return JSON 404', async () => {
  const { response, body } = await request('/gibt-es-nicht');

  assert.equal(response.status, 404);
  assert.equal(body.success, false);
  assert.equal(body.error, 'Route nicht gefunden');
});

test('CORS headers are only sent for the allowed origin', async () => {
  const allowed = await request('/health', {
    headers: {
      Origin: 'http://localhost:3000'
    }
  });
  const blocked = await request('/health', {
    headers: {
      Origin: 'http://evil.example'
    }
  });

  assert.equal(allowed.response.headers.get('access-control-allow-origin'), 'http://localhost:3000');
  assert.equal(blocked.response.headers.get('access-control-allow-origin'), null);
});
