# SECURITY-NOTES

## Projektbezogene Risikoanalyse

### Fehlende Eingabepruefung

Ohne Validierung koennte `POST /api/feedback` leere Werte, falsche Datentypen, sehr lange Texte oder unerwartete Felder wie `role` speichern. Das waere riskant, weil der Client nicht vertrauenswuerdig ist.

Umsetzung im Projekt:

- Pflichtfelder `name`, `email` und `message`
- Typpruefung auf Strings
- `trim()` gegen leere Strings und reine Leerzeichen
- Laengenlimits fuer alle Eingaben
- plausibles E-Mail-Format
- Positivliste erlaubter Felder

### Zu detaillierte Fehlermeldungen

Express- oder JavaScript-Fehler duerfen nicht als Stacktrace an Clients gehen, weil dadurch interne Details sichtbar werden koennen.

Umsetzung im Projekt:

- zentrale Fehlerbehandlung am Ende der Middleware-Kette
- generische JSON-Fehler bei unerwarteten Serverfehlern
- Syntaxfehler in JSON werden als kontrollierter `400` beantwortet

### Unnoetige Endpunkte oder Informationen

Jeder zusaetzliche Pfad vergroessert die Angriffsfläche. Die API bietet deshalb nur `GET /health`, `GET /api/feedback` und `POST /api/feedback` an.

Umsetzung im Projekt:

- unbekannte Routen liefern eine einheitliche JSON-404-Antwort
- gespeicherte interne Felder wie `internalSource` werden nicht in API-Responses ausgegeben
- `X-Powered-By` ist deaktiviert

### Zu grosszuegig erlaubte HTTP-Methoden

Nicht benoetigte Methoden wie `PUT`, `PATCH` oder `DELETE` sollen nicht stillschweigend akzeptiert werden.

Umsetzung im Projekt:

- `/health` erlaubt nur `GET`
- `/api/feedback` erlaubt nur `GET` und `POST`
- andere Methoden bekommen `405 Method Not Allowed` mit `Allow`-Header

### CORS ohne Einschraenkung

`Access-Control-Allow-Origin: *` waere fuer eine echte Anwendungs-API zu weit offen. CORS ersetzt keine Authentifizierung, sollte aber trotzdem gezielt konfiguriert werden.

Umsetzung im Projekt:

- erlaubte Origin kommt aus `ALLOWED_ORIGIN`
- Default ist `http://localhost:3000`
- erlaubte Methoden: `GET`, `POST`, `OPTIONS`
- erlaubter Header: `Content-Type`
- Preflight-Anfragen werden korrekt beantwortet
