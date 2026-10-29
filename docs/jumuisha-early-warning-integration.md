# Jumuisha AI ↔ ReGen Insights early-warning integration

The situation room now displays a **read-only** warning panel sourced from Jumuisha AI's `GET /v1/early-warning/alerts` and `GET /v1/early-warning/status` endpoints.

## Configure
In the ReGen frontend environment:
```bash
VITE_JUMUISHA_API_BASE_URL=https://your-trusted-jumuisha-api.example
```
Set Jumuisha API `JUMUISHA_ALLOWED_ORIGINS` to the exact ReGen frontend origin (e.g. `https://your-regen-frontend.example`). Configure production HTTPS and never put ingestion keys in a `VITE_` variable, browser code or static app bundle.

Run `npm run build` from the ReGen project to check TypeScript/Vite compilation.

## Trust and safety boundaries
- Public warnings remain government/authorized-publisher records, not ReGen AI predictions.
- The UI suppresses invalid, expired, future-dated, unverified or test alerts and never generates emergency messages.
- The source currently reports **no official live feed, durable warning storage or public push service**. The frontend connection does not fix these gaps.
- Empty data and network errors explicitly warn that absence of alerts is **not** evidence of safety.
- Source attribution and expiration are displayed; users can open the original issuer link.
- ReGen hazard severity tiles, mocked map pins, the “94% sensor health” metric and the cascade diagram are example/planning data, not real-time validated measurements.
- For public rollout implement official CAP-compatible source adapters, legal authorization, signatures, revocations, resilient DB/outbox, rate limits, incident approval workflow, multilingual accessibility, and synthetic disaster drills.
- Direct browser-to-API access requires restrictive CORS. For production, a server-side read-only gateway or same-origin proxy with caching and circuit breakers is preferable.

## Integration direction
1. Jumuisha → ReGen: verified public warnings for situational awareness (implemented).
2. ReGen → Jumuisha: potential forecasts, satellite detections and modeled impacts should be routed to a separate **analyst review queue**, never directly into the public authoritative alert stream (not implemented).
3. Approved issuing agency → Jumuisha: signed, authorized, audited CAP publication after independent validation and production readiness (not implemented).
