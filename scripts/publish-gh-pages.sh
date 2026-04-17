#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
branch="${PAGES_BRANCH:-gh-pages}"
remote="${PAGES_REMOTE:-origin}"
source_dir="$repo_root/apps/agent-site-server/gh-pages-dist"
tmpdir="$(mktemp -d /tmp/agent-site-gh-pages.XXXXXX)"
target_worktree=""
created_tmp_worktree=0

existing_worktree_for_branch() {
  git -C "$repo_root" worktree list --porcelain | awk -v branch_ref="refs/heads/$branch" '
    $1 == "worktree" { path = $2 }
    $1 == "branch" && $2 == branch_ref { print path; exit }
  '
}

cleanup() {
  if [[ "$created_tmp_worktree" == "1" ]] && git -C "$repo_root" worktree list --porcelain | grep -Fq "worktree $tmpdir"; then
    git -C "$repo_root" worktree remove --force "$tmpdir" >/dev/null 2>&1 || true
  fi
  rm -rf "$tmpdir"
}

trap cleanup EXIT

cd "$repo_root"
yarn build

target_worktree="$(existing_worktree_for_branch || true)"

if [[ -n "$target_worktree" ]]; then
  :
elif git show-ref --verify --quiet "refs/heads/$branch"; then
  git worktree add "$tmpdir" "$branch"
  target_worktree="$tmpdir"
  created_tmp_worktree=1
else
  git worktree add -b "$branch" "$tmpdir"
  target_worktree="$tmpdir"
  created_tmp_worktree=1
fi

if [[ ! -d "$source_dir" ]]; then
  echo "Missing export directory: $source_dir" >&2
  exit 1
fi

if [[ -z "$target_worktree" ]]; then
  echo "Failed to resolve target worktree for branch: $branch" >&2
  exit 1
fi

rsync -a --delete --exclude '.git' "$source_dir"/ "$target_worktree"/

git -C "$target_worktree" add -A

if git -C "$target_worktree" diff --cached --quiet; then
  echo "No gh-pages changes to publish."
  exit 0
fi

git -C "$target_worktree" commit -F - <<'EOF'
Publish current GitHub Pages snapshot

Sync the generated static site from gh-pages-dist into the
gh-pages branch so GitHub Pages can publish directly from the
branch root.

Constraint: GitHub Pages source is the gh-pages branch root
Confidence: high
Scope-risk: narrow
Directive: Run yarn build before publishing so dist and gh-pages-dist stay aligned
Tested: yarn build
EOF

git -C "$target_worktree" push "$remote" "HEAD:$branch"
