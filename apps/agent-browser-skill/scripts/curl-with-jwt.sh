#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <url> [method]"
  echo "Allowed hosts: localhost:3000, sahara.info, *.sahara.info, saharaa.info, *.saharaa.info"
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage
  exit 2
fi

url="$1"
method="${2:-GET}"
method="$(printf '%s' "$method" | tr '[:lower:]' '[:upper:]')"

DEFAULT_THREAD_ID="706326"
DEFAULT_CHAT_ID="5e790c8b-e167-4501-bab5-517b9201ded2"
DEFAULT_LOOP_ID="1768384652229"

if [[ "$url" =~ ^https?://localhost:3000([/?#].*)?$ ]]; then
  :
elif [[ "$url" =~ ^https?://([A-Za-z0-9-]+\.)*sahara\.info([:/?#].*)?$ ]]; then
  :
elif [[ "$url" =~ ^https?://([A-Za-z0-9-]+\.)*saharaa\.info([:/?#].*)?$ ]]; then
  :
else
  echo "Blocked URL. Only localhost:3000, *.sahara.info, and *.saharaa.info are allowed."
  exit 1
fi

read_env_value() {
  local key="$1"
  local file="$2"
  local line rest value

  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ -z "$line" || "$line" == \#* ]] && continue
    [[ "$line" != "$key="* ]] && continue

    rest="${line#"$key="}"
    value="$rest"

    if [[ "$value" =~ ^\".*\"$ ]]; then
      value="${value#\"}"
      value="${value%\"}"
    elif [[ "$value" =~ ^\'.*\'$ ]]; then
      value="${value#\'}"
      value="${value%\'}"
    fi

    printf '%s' "$value"
    return 0
  done < "$file"

  return 1
}

env_file=".env"
token="${SORIN_BRAIN_JWT:-${SORIN_JWT:-${JWT:-}}}"

if [[ -z "$token" && -f "$env_file" ]]; then
  token="$(read_env_value "SORIN_BRAIN_JWT" "$env_file" || true)"
  if [[ -z "$token" ]]; then
    token="$(read_env_value "SORIN_JWT" "$env_file" || true)"
  fi
  if [[ -z "$token" ]]; then
    token="$(read_env_value "JWT" "$env_file" || true)"
  fi
fi

if [[ -z "$token" ]]; then
  echo "Missing JWT. Set SORIN_BRAIN_JWT, SORIN_JWT, or JWT (env or .env)."
  exit 1
fi

append_param_if_missing() {
  local in_url="$1"
  local key="$2"
  local value="$3"

  if [[ "$in_url" == *"$key="* ]]; then
    printf '%s' "$in_url"
    return 0
  fi

  if [[ "$in_url" == *\?* ]]; then
    printf '%s&%s=%s' "$in_url" "$key" "$value"
  else
    printf '%s?%s=%s' "$in_url" "$key" "$value"
  fi
}

# Saharaa domain endpoints require thread/chat/loop context.
# Inject defaults only when missing, so explicit params still win.
if [[ "$url" =~ ^https?://([A-Za-z0-9-]+\.)*saharaa\.info([:/?#].*)?$ ]]; then
  url="$(append_param_if_missing "$url" "threadId" "$DEFAULT_THREAD_ID")"
  url="$(append_param_if_missing "$url" "chatId" "$DEFAULT_CHAT_ID")"
  url="$(append_param_if_missing "$url" "loopId" "$DEFAULT_LOOP_ID")"
fi

curl --silent --show-error --include --request "$method" \
  --header "Authorization: Bearer $token" \
  "$url"
