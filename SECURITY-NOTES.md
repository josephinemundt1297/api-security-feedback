# SECURITY-NOTES

## Projektbezogene Risikoanalyse

### Fehlende Eingabeprüfung

Ohne Validierung könnte `POST /api/feedback` leere Werte, falsche Datentypen, sehr lange Texte oder unerwartete Felder wie `role` speichern. Das wäre riskant, weil der Client nicht vertrauenswürdig ist.

Umsetzung im Projekt:

- Pflichtfelder `name`, `email` und `message`
- Typprüfung auf Strings
- `trim()` gegen leere Strings und reine Leerzeichen
- Längenlimits für alle Eingaben
- plausibles E-Mail-Format
- Positivliste erlaubter Felder

### Zu detaillierte Fehlermeldungen

Express- oder JavaScript-Fehler dürfen nicht als Stacktrace an Clients gehen, weil dadurch interne Details sichtbar werden können.

Umsetzung im Projekt:

- zentrale Fehlerbehandlung am Ende der Middleware-Kette
- generische JSON-Fehler bei unerwarteten Serverfehlern
- Syntaxfehler in JSON werden als kontrollierter `400` beantwortet

### Unnötige Endpunkte oder Informationen

Jeder zusätzliche Pfad vergrößert die Angriffsfläche. Die API bietet deshalb nur `GET /health`, `GET /api/feedback` und `POST /api/feedback` an.

Umsetzung im Projekt:

- unbekannte Routen liefern eine einheitliche JSON-404-Antwort
- gespeicherte interne Felder wie `internalSource` werden nicht in API-Responses ausgegeben
- `X-Powered-By` ist deaktiviert

### Zu großzügig erlaubte HTTP-Methoden

Nicht benötigte Methoden wie `PUT`, `PATCH` oder `DELETE` sollen nicht stillschweigend akzeptiert werden.

Umsetzung im Projekt:

- `/health` erlaubt nur `GET`
- `/api/feedback` erlaubt nur `GET` und `POST`
- andere Methoden bekommen `405 Method Not Allowed` mit `Allow`-Header

### CORS ohne Einschränkung

`Access-Control-Allow-Origin: *` wäre für eine echte Anwendungs-API zu weit offen. CORS ersetzt keine Authentifizierung, sollte aber trotzdem gezielt konfiguriert werden.

Umsetzung im Projekt:

- erlaubte Origin kommt aus `ALLOWED_ORIGIN`
- Default ist `http://localhost:3000`
- erlaubte Methoden: `GET`, `POST`, `OPTIONS`
- erlaubter Header: `Content-Type`
- Preflight-Anfragen werden korrekt beantwortet
