---
title: Social API
summary: Single-call social trend lookup with strict minimal-read output.
---
**Canonical URL**
`https://gcp-dev.saharaa.info/developer/api/agents/tool/social?query=<url_encoded_query>`

## HTTP Contract
- Method: `GET`
- Host: `gcp-dev.saharaa.info`
- Path: `/developer/api/agents/tool/social`
- Required query param: `query`
- Header: `Authorization: Bearer <JWT>` (if auth is enabled upstream)

## Fast Path
1. Build one focused query (2-6 words).
2. URL-encode the query.
3. Call once.
4. Extract only the minimal fields.
5. If request fails, retry once with a shorter query.

## Query Hygiene
- Keep one asset/topic per call (`BTC trend`, `BTC sentiment`).
- Avoid multi-topic prompts (`BTC vs ETH vs SOL`) unless required.
- Prefer short nouns over long questions.

## Request Example
```bash
curl-with-jwt.sh \
  "https://gcp-dev.saharaa.info/developer/api/agents/tool/social?query=BTC+trend"
```

## Failure Handling
- `400`: missing/invalid params; fix request and retry once.
- `401/403`: JWT invalid/expired; refresh token then retry once.
- `5xx` or timeout: retry once with backoff (`0.5-1.0s`).
- If retry fails, return information for debugging.

## See Also
- [Where is curl-with-jwt.sh?](/index/)

