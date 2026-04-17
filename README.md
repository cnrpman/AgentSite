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

For GitHub Pages export:

- `yarn --ignore-engines build`
- `yarn --ignore-engines export:gh-pages`

This produces a dual-output static bundle where raw Markdown remains available as `.md` files and a readable static viewer is generated under `viewer/`.

## Content Architecture

`apps/agent-site-server/content` is intentionally compressed:

- `index.md` - the only product page, containing tool signatures, call order, defaults, and stop conditions

The product page now documents callable tools only. Behavior/profile/placeholder layers were removed from the public content tree to reduce noise.

The rule for the product surface is simple: keep only invocation-critical content on one page.

## Notes

- `apps/agent-browser-skill` includes:
  - `SKILL.md`
  - `scripts/curl-with-jwt.sh` for `Authorization: Bearer <JWT>` requests to `localhost:3000` and `*.sahara.info`
- `apps/agent-site-server/content` is reduced to a single tool-only page.
- `apps/agent-site-autosearch` is currently an empty scaffold.
- Keep each app independently runnable and documented as implementation starts.
