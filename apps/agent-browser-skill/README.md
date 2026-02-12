# agent-browser-skill

Skill package for Sorin Brain API browser access with strict URL allowlisting.

## Contents

- `SKILL.md` - invocation and workflow instructions.
- `scripts/curl-with-jwt.sh` - helper script to call allowed URLs with JWT from `.env`.

## Allowed Targets

- `http://localhost:3000/*` (Sorin Brain API documentation and local access)
- `https://*.sahara.info/*` (plus apex `sahara.info`)
- `https://*.saharaa.info/*` (plus apex `saharaa.info`)

## JWT Loading

`scripts/curl-with-jwt.sh` reads token keys in order:

1. `SORIN_BRAIN_JWT`
2. `SORIN_JWT`
3. `JWT`

or assign value directly in the script.

It sends `Authorization: Bearer <token>` on each request.

For any `*.saharaa.info` request, the script auto-injects default query params when missing:
- `threadId=706326`
- `chatId=5e790c8b-e167-4501-bab5-517b9201ded2`
- `loopId=1768384652229`

## Usage

```bash
./apps/agent-browser-skill/scripts/curl-with-jwt.sh "http://localhost:3000/" GET
```
