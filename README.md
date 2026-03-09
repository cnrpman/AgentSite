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

## Content Architecture

`apps/agent-site-server/content` now follows a layered agent-doc structure:

- `soul/` - immutable agent identity and behavioral rules
- `memory/` - user-specific durable preferences
- `tool/` - callable tool contracts and parameter docs
- `skill/` - placeholder only; no standalone mock skill pages

The tool layer is the main source of truth for runtime behavior. Multi-step patterns that were previously described as “skills” are now documented as tool combinations inside the tool docs.

For stable prompt layers such as `soul/` and `memory/`, prefer a small number of denser pages, with a rough target of about 2000 tokens per page. This reduces retrieval overhead when the docs are consumed during tool-calling flows.

The root `content/index.md` should also behave as a router page: one dense read that points the agent toward the smallest relevant next branch.

## Notes

- `apps/agent-browser-skill` includes:
  - `SKILL.md`
  - `scripts/curl-with-jwt.sh` for `Authorization: Bearer <JWT>` requests to `localhost:3000` and `*.sahara.info`
- `apps/agent-site-server/content` is now organized around the `SOUL` / `MEMORY` / `TOOL` / `SKILL` layers, with tool pages aligned to real function definitions.
- `apps/agent-site-autosearch` is currently an empty scaffold.
- Keep each app independently runnable and documented as implementation starts.
