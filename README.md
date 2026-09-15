# API Security Feedback API

Kleine Node.js-/Express-API fuer die individuelle Learning Phase zu API Security und CORS.

## Start

```bash
npm install
ALLOWED_ORIGIN=http://localhost:3000 npm start
```

Die API laeuft standardmaessig auf `http://localhost:4000`.

## Endpunkte

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/health` | Liefert den API-Status |
| `GET` | `/api/feedback` | Liefert gespeicherte Feedback-Eintraege |
| `POST` | `/api/feedback` | Speichert ein neues Feedback |

## Response-Schema

Erfolg:

```json
{
  "success": true,
  "data": {}
}
```

Fehler:

```json
{
  "success": false,
  "error": "Kurze Fehlermeldung",
  "details": []
}
```

## Beispiel-Request

```bash
curl -i -X POST http://localhost:4000/api/feedback \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"name":"Max","email":"max@example.com","message":"Das ist ein hilfreiches Feedback."}'
```

## Umgesetzte Security-Massnahmen

- `X-Powered-By` ist deaktiviert.
- JSON-Request-Bodies sind auf `10kb` begrenzt.
- `POST /api/feedback` akzeptiert nur `Content-Type: application/json`.
- Eingaben werden nach Typ, Pflichtfeld, Laenge und erlaubten Feldern validiert.
- Unbekannte Felder werden abgelehnt, damit kein Mass Assignment entsteht.
- Responses nutzen ein einheitliches JSON-Format.
- Unbekannte Routen liefern eine JSON-404-Antwort.
- Nicht vorgesehene HTTP-Methoden liefern `405 Method Not Allowed`.
- Unerwartete Serverfehler liefern keine Stacktraces oder internen Pfade.
- CORS erlaubt nur die konfigurierte Origin und die benoetigten Methoden/Header.

## Tests

```bash
npm test
```
