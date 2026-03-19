#!/usr/bin/env bash
# Deploy Agent Site to Google Cloud Run (builds from source in Cloud Build).
# Prereqs: gcloud CLI, project set (gcloud config set project PROJECT_ID).
#
# Required env: SITE_PASSWORD (Express login + /content/*). Example:
#   export SITE_PASSWORD='your-secret'
#   ./scripts/deploy-cloudrun.sh
set -e

SERVICE_NAME="${CLOUD_RUN_SERVICE:-agent-site}"
REGION="${CLOUD_RUN_REGION:-us-central1}"
PROJECT_ID="${GCP_PROJECT:-ai-mle}"

if [ -z "$PROJECT_ID" ]; then
  echo "Error: GCP project not set. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

if [ -z "$SITE_PASSWORD" ]; then
  echo "Error: SITE_PASSWORD is not set. Export it before deploy, e.g.:"
  echo "  export SITE_PASSWORD='your-secret'"
  echo "  ./scripts/deploy-cloudrun.sh"
  exit 1
fi

echo "Deploying $SERVICE_NAME to Cloud Run (project=$PROJECT_ID, region=$REGION) ..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "SITE_PASSWORD=${SITE_PASSWORD}" \
  --quiet

echo "Done. Service URL:"
gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format='value(status.url)'
