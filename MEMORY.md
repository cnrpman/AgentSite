# Memory

## 2026-02-12
- Codex system skill utilities `init_skill.py` and `quick_validate.py` require Python package `PyYAML`; if unavailable, create skill files manually or install `pyyaml` first.
- In this Codex sandbox, local loopback/network calls may fail with `Operation not permitted`; rerun critical localhost or network commands with escalated permissions instead of assuming the service is down.
