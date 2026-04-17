# Memory

## 2026-02-12
- Codex system skill utilities `init_skill.py` and `quick_validate.py` require Python package `PyYAML`; if unavailable, create skill files manually or install `pyyaml` first.
- In this Codex sandbox, local loopback/network calls may fail with `Operation not permitted`; rerun critical localhost or network commands with escalated permissions instead of assuming the service is down.

## 2026-03-09
- For agent-facing doc sites used during tool-calling, optimize for total context cost: stable guidance layers like `SOUL` and `MEMORY` should prefer fewer, denser pages of roughly 2000 tokens each instead of many tiny pages, because every extra fetch has prompt overhead.

## 2026-04-17
- For retrieval-heavy doc trees where the root and first branch pages are often co-fetched, page boundaries should follow high-frequency access paths rather than textbook taxonomy: fill upper pages with shared context first, target roughly `2k-5k` tokens when practical, and only split downward once the parent is already dense or the access pattern clearly diverges.
- If a user wants an agent-facing doc surface aggressively deslopped, prioritize callable signatures and sequencing over page-size targets; a 2-page tool-only surface can be better than a denser but noisier hierarchy.
- A shared `flows` page is often a trap: models tend to fetch it for every request. Prefer scene-specific closed pages that repeat local signatures and stop conditions instead of routing through a universal second page.
