# Agent-friendly Markdown Directory Site

Pure Markdown directory tree for agents that only have `visit(url)`. All URLs are trailing-slash nodes, every page includes breadcrumb + summary + navigation lists, and the origin server only serves static Markdown from `dist/`.

## Quickstart

From repository root:

```bash
yarn install
yarn build
yarn dev
```

Or from this directory:

```bash
yarn install
yarn build
yarn dev
```

Visit Markdown API at `http://localhost:3000/`.
Viewer is available at `http://localhost:3000/viewer/`.

## Scripts

- `yarn build` → generate `dist/` from `content/` and run checks
- `yarn run check` → validate page contract, links, and reachability
- `yarn dev` → run Fastify server with TS runtime (`tsx watch`)
- `yarn build:server` → compile TypeScript to `build/`
- `yarn start` → run compiled server (`node build/server.js`)

## Content Authoring

- Source files live in `content/`.
- Directory pages use `content/<path>/index.md`.
- Content pages use `content/<path>/<slug>.md`.
- All segments must match `[a-z0-9-_]` (lowercase only).

Frontmatter is optional:

```yaml
---
title: Visit URL Tool
summary: How to use visit(url) to traverse the Markdown directory site.
---
```

## API Book Structure (Recommended)

The current content is organized as a low-token API call book:

- `content/index.md` - entry page and reading order.
- `content/social.md` - first concrete API page (URL access pattern).
- `content/blueprint.md` - copyable template for new API pages.
- `content/cost.md` - attention/call cost guardrails.
- `content/backlog.md` - slot tracking toward ~20 APIs.

Each API page should keep a fixed section order:
1. Canonical URL
2. HTTP Contract
3. Fast Path
4. Request Example
5. Response Handling (Minimal Contract)
6. Failure Handling
7. See also

## Output Rules

- `dist/` mirrors URL structure.
- Every output page includes:
  - H1 title
  - `**Navigation:**`
  - `**Summary:**`
  - `---`
- Directory pages always contain `**Subdirectories** under this directory:` and `**Pages** in this directory:` labels with bullet lists (use `- (none)` when empty).

## Server Behavior (Markdown Service)

- `GET /` → `dist/index.md`
- `GET /<dir>/` → `dist/<dir>/index.md`
- `GET /<path>/<page>/` → `dist/<path>/<page>.md`
- `GET /healthz` → `OK`
- `GET /llms.txt` → same Markdown as `/`

Cache headers and ETag are set for all Markdown responses.

## Viewer

- Runs in the same process/port as the Markdown service.
- Renders HTML at `/viewer/` and rewrites internal links to stay in the viewer.
- Displays token counts based on the Markdown API response.

Environment variables:
- `MARKDOWN_PORT` (markdown service port, default 3000)
- `HOST` (bind host, default 0.0.0.0)
- `MARKDOWN_BASE_URL` (viewer fetch target, default `http://localhost:<MARKDOWN_PORT>`)
