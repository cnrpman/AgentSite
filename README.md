# Agent Site

Vue 3 SPA: agent docs viewer with Soul, Memory, Tool, Skill layers. Content is markdown in `public/content/`.

## Setup

```bash
yarn install
```

## Dev

```bash
yarn dev
```

Open http://localhost:5174. Nav: Home, Soul, Memory, Tool, Skill. Edit content in `public/content/`.

## Build

```bash
yarn build
```

Output in `dist/`. Deploy the `dist/` folder or use the Dockerfile for Cloud Run.

## Deploy (Cloud Run)

From repo root:

```bash
docker build -t agent-site .
docker run -p 8080:8080 -e PORT=8080 agent-site
```

Then push to Artifact Registry and deploy to Cloud Run, or use `gcloud run deploy` with the Dockerfile.
