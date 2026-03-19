# Agent-friendly Markdown Directory Site

Pure Markdown directory tree for agent-facing docs. All URLs are trailing-slash nodes, every page includes breadcrumb + summary + navigation lists, and the origin server only serves static Markdown from `dist/`.

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
- `yarn export:gh-pages` → generate `gh-pages-dist/` with both raw Markdown and static viewer HTML
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

## Content Structure

The current content is organized as a layered agent prompt reference:

- `content/index.md` - entry page and reading order
- `content/soul/` - identity, rules, truth policy, formatting, supported chains
- `content/memory/` - durable user preferences and defaults
- `content/tool/` - callable tool contracts aligned to real function definitions, with a dense router-style `index.md`
- `content/skill/` - placeholder page only; no standalone skill mocks

Tool pages should document:
1. Purpose
2. Parameters
3. Output shape or workflow notes when relevant
4. Invocation rules or constraints
5. See also

For stable reference sections such as `content/soul/` and `content/memory/`, prefer fewer, denser pages with an approximate target of 2000 tokens per page. The goal is to minimize total retrieval cost rather than maximize page granularity.

For `content/tool/`, keep the index page dense and router-oriented so an agent can choose the right tool family with one read, then fetch only the specific tool pages it needs.

Apply the same router principle to `content/index.md`: it should quickly route the reader to `soul/`, `memory/`, `tool/`, or `skill/` with minimal explanatory overhead.

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

## GitHub Pages Export

`yarn export:gh-pages` creates `gh-pages-dist/` with both artifacts that matter for this project:

- raw Markdown pages preserved as `.md` files for agents
- matching human-readable static pages under `viewer/`

The export also adds:

- `index.html` as a landing page linking to both modes
- `.nojekyll` so GitHub Pages serves Markdown files as raw files instead of transforming them away
- `llms.txt` copied from the Markdown homepage

Environment variables:
- `MARKDOWN_PORT` (markdown service port, default 3000)
- `HOST` (bind host, default 0.0.0.0)
- `MARKDOWN_BASE_URL` (viewer fetch target, default `http://localhost:<MARKDOWN_PORT>`)
