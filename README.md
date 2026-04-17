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
- `yarn publish:gh-pages`

`yarn build` now produces both `dist/` and `apps/agent-site-server/gh-pages-dist/`. No separate branch-switching flow is required for local export generation.
`yarn publish:gh-pages` syncs `gh-pages-dist/` into the local `gh-pages` branch and pushes it to `origin`.

## Content Architecture

`apps/agent-site-server/content` is intentionally compressed:

- `index.md` - scene entry points and a small set of shared rules
- `token.md`, `project.md`, `protocol-chain.md`, `market-signal.md`, `wallet.md`, `staking.md`, `execution.md`, `alert.md` - scene-specific closed pages

The product pages document callable tools only. Behavior/profile/placeholder layers were removed from the public content tree to reduce noise.

The current rule is: keep the homepage thin and public, then let scene pages carry their own signatures, parameter shapes, sequencing, and stop conditions so the model does not need to bounce through a shared `flows` page.

## Notes

- `apps/agent-browser-skill` includes:
  - `SKILL.md`
  - `scripts/curl-with-jwt.sh` for `Authorization: Bearer <JWT>` requests to `localhost:3000` and `*.sahara.info`
- `apps/agent-site-server/content` now uses a tool-only surface: one full reference plus scene pages.
- `apps/agent-site-autosearch` is currently an empty scaffold.
- Keep each app independently runnable and documented as implementation starts.
