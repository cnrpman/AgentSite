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
- `yarn run check` → validate page contract, links, reachability, and print a token-budget report for generated Markdown
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

The current content is intentionally minimal:

- `content/index.md` - scene entry points and shared global rules
- `content/token.md`
- `content/project.md`
- `content/protocol-chain.md`
- `content/market-signal.md`
- `content/wallet.md`
- `content/staking.md`
- `content/execution.md`
- `content/alert.md`

The public content tree no longer includes separate `soul`, `memory`, or `skill` layers. The goal is to keep only the information needed to call tools, with a thin homepage plus scene-specific closed pages.

`content/index.md` should document:
1. Which scene page to open
2. The small set of shared rules that apply everywhere
3. Cross-scene sequencing rules that truly belong on the homepage

Each scene page should document:
1. Which exact scene it covers
2. Only the tool signatures needed for that scene
3. Parameter shapes for that scene
4. Scene-specific call order
5. Scene-specific stop conditions and "do not" rules

Do not add a shared `flows` page. It becomes a hot page and defeats the purpose of branching.

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
