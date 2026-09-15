# API Security Feedback API

Kleine Node.js-/Express-API für die individuelle Learning Phase zu API Security und CORS.

## Start

```bash
npm install
ALLOWED_ORIGIN=http://localhost:3000 npm start
```

Die API läuft standardmäßig auf `http://localhost:4000`.

## Endpunkte

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/health` | Liefert den API-Status |
| `GET` | `/api/feedback` | Liefert gespeicherte Feedback-Einträge |
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

## Umgesetzte Security-Maßnahmen

- `X-Powered-By` ist deaktiviert.
- JSON-Request-Bodies sind auf `10kb` begrenzt.
- `POST /api/feedback` akzeptiert nur `Content-Type: application/json`.
- Eingaben werden nach Typ, Pflichtfeld, Länge und erlaubten Feldern validiert.
- Unbekannte Felder werden abgelehnt, damit kein Mass Assignment entsteht.
- Responses nutzen ein einheitliches JSON-Format.
- Unbekannte Routen liefern eine JSON-404-Antwort.
- Nicht vorgesehene HTTP-Methoden liefern `405 Method Not Allowed`.
- Unerwartete Serverfehler liefern keine Stacktraces oder internen Pfade.
- CORS erlaubt nur die konfigurierte Origin und die benötigten Methoden/Header.

## Tests

```bash
npm test
```
