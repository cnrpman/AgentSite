# Sahara AI Execution Agent

**Navigation:** [Home](/)

**Summary:** Router page for the layered agent docs. Read this once, then jump to the smallest relevant branch.

---

This site is organized for low-cost retrieval during tool-calling. Read this page first, then jump to only the layer that matches the current need.

## Fast Routing Table

| If the current need is... | Go to | Why |
|---------------------------|-------|-----|
| agent identity, hard rules, truth constraints | [soul](/AgentSite/soul/index.md) | Stable behavior and runtime rules |
| user preference shaping, defaults, wallet conventions | [memory](/AgentSite/memory/index.md) | User-specific but durable context |
| real capabilities, parameters, execution setup | [tool](/AgentSite/tool/index.md) | Primary source of runtime behavior |
| whether there are standalone skills | [skill](/AgentSite/skill/index.md) | Placeholder only at the moment |

## Layer Summary

| Layer | Responsibility | Stability |
|-------|---------------|-----------|
| SOUL | Identity, hard constraints, immutable rules | Never changes |
| MEMORY | User preferences, durable configuration | Changes when user profile updates |
| TOOL | Atomic capabilities, tool contracts | Changes when tools are added/removed |
| SKILL | Placeholder for future explicit workflows | Minimal for now |

## Reading Guidance

- In most cases, start with [tool](/AgentSite/tool/index.md) if the question is operational
- Read [soul](/AgentSite/soul/index.md) only when behavior rules or output policy matter
- Read [memory](/AgentSite/memory/index.md) when user preference shaping matters
- Read [skill](/AgentSite/skill/index.md) only to confirm that skills are currently just a placeholder

## Packaging Principle

These docs favor fewer, denser router pages because every extra fetch adds context overhead. Stable layers should stay compact, and index pages should help the reader choose the next page with minimal branching.

**Subdirectories** under this directory:
- [memory](/AgentSite/memory/index.md)
- [skill](/AgentSite/skill/index.md)
- [soul](/AgentSite/soul/index.md)
- [tool](/AgentSite/tool/index.md)

**Pages** in this directory:
- (none)
