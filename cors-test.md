# CORS-Testprotokoll

Serverstart:

```bash
ALLOWED_ORIGIN=http://localhost:3000 npm start
```

## 1. Request mit erlaubter Origin

```bash
curl -i http://localhost:4000/health \
  -H "Origin: http://localhost:3000"
```

Erwartung:

- Status `200 OK`
- Header `Access-Control-Allow-Origin: http://localhost:3000`
- JSON-Body mit `success: true`

Ergebnis am 15.09.2026:

- Status `200 OK`
- `Access-Control-Allow-Origin: http://localhost:3000`
- Body: `{"success":true,"data":{"status":"ok"}}`

## 2. Request mit nicht erlaubter Origin

```bash
curl -i http://localhost:4000/health \
  -H "Origin: http://evil.example"
```

Erwartung:

- Status `200 OK`, weil CORS keine allgemeine Zugriffskontrolle für curl ist
- kein Header `Access-Control-Allow-Origin`
- Browser-JavaScript von dieser Origin dürfte die Antwort nicht verwenden

Ergebnis am 15.09.2026:

- Status `200 OK`
- kein `Access-Control-Allow-Origin`-Header
- Body: `{"success":true,"data":{"status":"ok"}}`

## 3. Preflight-Request mit OPTIONS

```bash
curl -i -X OPTIONS http://localhost:4000/api/feedback \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

Erwartung:

- Status `204 No Content`
- Header `Access-Control-Allow-Origin: http://localhost:3000`
- Header `Access-Control-Allow-Methods` enthält `GET,POST,OPTIONS`
- Header `Access-Control-Allow-Headers` enthält `Content-Type`

Ergebnis am 15.09.2026:

- Status `204 No Content`
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## 4. POST mit JSON-Body

```bash
curl -i -X POST http://localhost:4000/api/feedback \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"name":"Mina","email":"mina@example.com","message":"Das ist ein valider Feedbacktext."}'
```

Erwartung:

- Status `201 Created`
- Header `Access-Control-Allow-Origin: http://localhost:3000`
- JSON-Body mit `success: true` und dem gespeicherten Feedback

Ergebnis am 15.09.2026:

- Status `201 Created`
- `Access-Control-Allow-Origin: http://localhost:3000`
- Body enthält `success: true` und den gespeicherten Feedback-Eintrag

## 5. Verhalten mit anderer ALLOWED_ORIGIN

Start mit anderer erlaubter Origin:

```bash
ALLOWED_ORIGIN=http://localhost:5173 npm start
```

Erwartung:

- Requests mit `Origin: http://localhost:5173` bekommen den CORS-Allow-Origin-Header.
- Requests mit `Origin: http://localhost:3000` bekommen dann keinen CORS-Allow-Origin-Header mehr.
