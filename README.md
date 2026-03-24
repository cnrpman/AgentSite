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

`apps/agent-site-server/content` now follows a layered agent-doc structure:

- `soul/` - immutable agent identity and behavioral rules
- `runtime/` - operational output rules (chains, formatting, token handling)
- `output/` - output style policy (response structure, citations, token display constraints)
- `memory/` - user-specific durable preferences
- `tool/` - callable tool contracts and parameter docs

The site is now explicitly organized for progressive disclosure with shallow depth:

- Start from `content/index.md` (home).
- Route to the relevant layer indexes (`soul/`, `runtime/`, `output/`, `memory/`, `tool/`).
- Traverse multiple pages when needed for dependencies, validation, or multi-step workflows.

Target navigation depth is two hops from home for most tasks.

The tool layer remains the runtime source of truth. Multi-step patterns that were previously described as “skills” are documented as tool combinations inside the tool docs.

For stable prompt layers such as `soul/` and `memory/`, prefer a small number of denser pages, with a rough target of about 2000 tokens per page. This reduces retrieval overhead when the docs are consumed during tool-calling flows.

The root `content/index.md` acts as a strict router page and includes critical execution policy (tool-first, no silent failure, no truncation of technical identifiers).

## Notes

- `apps/agent-browser-skill` includes:
  - `SKILL.md`
  - `scripts/curl-with-jwt.sh` for `Authorization: Bearer <JWT>` requests to `localhost:3000` and `*.sahara.info`
- `apps/agent-site-server/content` is organized around `SOUL` / `RUNTIME` / `OUTPUT` / `MEMORY` / `TOOL`, with tool pages aligned to real function definitions.
- `apps/agent-site-autosearch` is currently an empty scaffold.
- Keep each app independently runnable and documented as implementation starts.

## Reliability Controls (agent-site-server)

The markdown/viewer server includes concurrency-oriented reliability controls:

- Fastify timeouts and keepalive tuning (`REQUEST_TIMEOUT_MS`, `CONNECTION_TIMEOUT_MS`, `KEEP_ALIVE_TIMEOUT_MS`)
- Route index and markdown content in-memory caching to reduce per-request filesystem overhead
- Viewer render cache with in-flight request coalescing to prevent duplicate markdown fetch/parse under bursts
- Viewer upstream markdown fetch timeout (`VIEWER_FETCH_TIMEOUT_MS`) and bounded cache size (`VIEWER_CACHE_MAX_ENTRIES`)
- Graceful shutdown on `SIGINT`/`SIGTERM`
