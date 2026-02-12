# Agent Site Monorepo

This repository now uses a lightweight monorepo layout.

## Project Layout

- `apps/agent-site-server` - main project: agent-friendly Markdown directory web server.
- `apps/agent-browser-skill` - Sorin Brain API browser skill with JWT-backed URL fetch helper.
- `apps/agent-site-autosearch` - planned project: automatic heuristic site-structure search/optimization.
- `agent_log/` - implementation history.
- `AGENTS.md` - collaboration and engineering profile.

## Quickstart (Main Project)

```bash
yarn install
yarn build
yarn dev
```

The root scripts proxy to `apps/agent-site-server`.

- Markdown API: `http://localhost:3000/`
- Viewer: `http://localhost:3000/viewer/`

## Notes

- `apps/agent-browser-skill` includes:
  - `SKILL.md`
  - `scripts/curl-with-jwt.sh` for `Authorization: Bearer <JWT>` requests to `localhost:3000` and `*.sahara.info`
- `apps/agent-site-server/content` now uses an API-book layout focused on low LLM attention load:
  - Start at `/`
  - First concrete endpoint page: `/social/`
  - Blueprint for scaling to ~20 endpoints: `/blueprint/` + `/backlog/`
- `apps/agent-site-autosearch` is currently an empty scaffold.
- Keep each app independently runnable and documented as implementation starts.
