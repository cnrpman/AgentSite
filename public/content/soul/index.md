---
title: SOUL Layer
summary: Agent identity and immutable runtime rules, consolidated into a small number of pages to reduce context-fetch cost.
---
The SOUL layer defines what the agent IS and what it will NEVER do. These rules are constant across all users, sessions, and tasks.

| Aspect | Content | Page |
|--------|---------|------|
| Core Rules | Identity, scope, operating principles, truth policy | [core](/soul/core/) |
| Runtime Rules | Supported chains, response format, token handling | [runtime](/soul/runtime/) |

**Key principle**: Nothing in SOUL depends on who the user is. If you need user-specific behavior, see [memory](/memory/).

**Packaging principle**: Keep SOUL in a few dense pages rather than many small ones, because every page fetch has context cost during tool-calling workflows.
