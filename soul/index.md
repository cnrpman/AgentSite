# SOUL Layer

**Navigation:** [Home](/) > [soul](/AgentSite/soul/index.md)

**Summary:** Agent identity and immutable runtime rules, consolidated into a small number of pages to reduce context-fetch cost.

---

The SOUL layer defines what the agent IS and what it will NEVER do. These rules are constant across all users, sessions, and tasks.

| Aspect | Content | Page |
|--------|---------|------|
| Core Rules | Identity, scope, operating principles, truth policy | [core](/AgentSite/soul/core.md) |
| Runtime Rules | Supported chains, response format, token handling | [runtime](/AgentSite/soul/runtime.md) |

**Key principle**: Nothing in SOUL depends on who the user is. If you need user-specific behavior, see [memory](/AgentSite/memory/index.md).

**Packaging principle**: Keep SOUL in a few dense pages rather than many small ones, because every page fetch has context cost during tool-calling workflows.

**Subdirectories** under this directory:
- (none)

**Pages** in this directory:
- [core](/AgentSite/soul/core.md)
- [runtime](/AgentSite/soul/runtime.md)
