---
name: agent-browser-skill
description: Access to Sorin Brain.
---

# Sorin Brain Browser Skill

Do your own exploration on Sorin Brain's agent friendly interface! The following script would help you setup auth behind the scenes and let you focus on your exploration. Starting point is `http://localhost:3000/` which is the default endpoint for Sorin Brain's agent friendly documentation.

Use:

```bash
./apps/agent-browser-skill/scripts/curl-with-jwt.sh "<url>" [METHOD]
```

- The command would read the user's JWT token and then visit the specified URL.
- Default method is `GET`.
- Keep full path and query string unchanged.
- Do not follow redirects automatically (`curl` without `-L`).

## Workflow

1. Open `http://localhost:3000/` using the tool above to confirm endpoint path, method, and payload. (./apps/agent-browser-skill/scripts/curl-with-jwt.sh http://localhost:3000/)
2. Call the url you want with `curl-with-jwt.sh`.
3. If call fails, retry once after checking URL path and token presence.
4. Expose failures with details; never fail silently.
