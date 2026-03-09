# MEMORY Layer

**Navigation:** [Home](/) > [memory](/AgentSite/memory/)

**Summary:** User-specific preferences and defaults, consolidated to keep retrieval overhead low.

---

The MEMORY layer stores everything that varies per user but persists across sessions. These are NOT part of the agent's identity - they shape how the agent adapts its output to a specific user.

| Preference | Current Setting | Page |
|-----------|----------------|------|
| User Profile | Trading style, horizon, product preference, risk, information style, execution environment | [profile](/AgentSite/memory/profile/) |
| Defaults | Wallet address, chain, amount conventions | [defaults](/AgentSite/memory/defaults/) |

**Why these are MEMORY, not SOUL**: A different user could have low risk tolerance, short-term horizon, and DEX-first preference. The agent's core identity doesn't change - only its output framing does.

**Packaging principle**: Prefer a few pages around 2000 tokens each over many tiny pages, because each additional fetch increases context overhead.

**Subdirectories** under this directory:
- (none)

**Pages** in this directory:
- [defaults](/AgentSite/memory/defaults/)
- [profile](/AgentSite/memory/profile/)
