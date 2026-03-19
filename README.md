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

**One-time setup:** Install [gcloud CLI](https://cloud.google.com/sdk/docs/install), log in (`gcloud auth login`), set project (`gcloud config set project YOUR_PROJECT_ID`).

**Deploy from source** (Cloud Build builds the Dockerfile in the cloud; no local Docker required):

```bash
./scripts/deploy-cloudrun.sh
```

Optional env vars: `CLOUD_RUN_SERVICE=agent-site`, `CLOUD_RUN_REGION=us-central1`, `GCP_PROJECT=your-project-id`.

**Or** build and run locally first:

```bash
docker build -t agent-site .
docker run -p 8080:8080 -e PORT=8080 agent-site
```
