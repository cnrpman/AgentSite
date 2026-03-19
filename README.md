# Agent Site

Vue 3 SPA: agent docs viewer with Soul, Memory, Tool, Skill layers. Content is markdown in `content/` and is served only after login (cookie-based auth).

## Setup

```bash
yarn install
export SITE_PASSWORD=your-secret   # required for the content API (OS env only; server does not load `.env`)
```

See `.env.example` for a variable checklist (copy values into your shell, launch config, or host).

## Dev

```bash
yarn dev
```

This starts the **content API** on port **3080** and **Vite** on **5174** (Vite proxies `/api` and `/content` to 3080). If you see `ECONNREFUSED` from the proxy, the API process exited — ensure **`SITE_PASSWORD` is set in the environment** that runs `node server/index.js` and check the `api` lines in the terminal.

To run only Vite (no protected content): `yarn dev:vite` (you must run `yarn dev:server` separately in another terminal).

Open http://localhost:5174. Sign in with `SITE_PASSWORD`; the server sets an httpOnly cookie. All requests to `/content/*` (viewer and Raw Markdown download) require that cookie **or** the same password as a Bearer token (for scripts / `curl`).

```bash
# Hit the API directly (port 3080) or through Vite (5174); header is forwarded by the proxy.
curl -sS -H "Authorization: Bearer YOUR_PASSWORD" http://localhost:3080/content/tool/index.md
```

Edit content in `content/` (not in `public/`).

## Build

```bash
yarn build
```

Output in `dist/`. To run locally with protected content: `SITE_PASSWORD=secret yarn start` (uses `dist/` + `content/`).

## Deploy (Cloud Run)

**One-time setup:** Install [gcloud CLI](https://cloud.google.com/sdk/docs/install), log in (`gcloud auth login`), set project (`gcloud config set project YOUR_PROJECT_ID`).

**Deploy from source** (Cloud Build builds the Dockerfile in the cloud; no local Docker required):

```bash
export SITE_PASSWORD='your-secret'   # required; passed to Cloud Run as an env var
./scripts/deploy-cloudrun.sh
```

Optional: `CLOUD_RUN_SERVICE=agent-site`, `CLOUD_RUN_REGION=us-central1`, `GCP_PROJECT=your-project-id`.

To rotate the password later without redeploying from this script: `gcloud run services update SERVICE --set-env-vars SITE_PASSWORD=...`

**Or** build and run locally:

```bash
docker build -t agent-site .
docker run -p 8080:8080 -e PORT=8080 -e SITE_PASSWORD=yourpassword agent-site
```
