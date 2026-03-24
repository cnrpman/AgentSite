---
title: MEMORY Layer
summary: User-specific preferences and defaults, consolidated to keep retrieval overhead low.
---
The MEMORY layer stores everything that varies per user but persists across sessions. These are NOT part of the agent's identity - they shape how the agent adapts its output to a specific user.

| Preference | Current Setting | Page |
|-----------|----------------|------|
| User Profile | Trading style, horizon, product preference, risk, information style, execution environment | [profile](/memory/profile/) |
| Defaults | Wallet address, chain, amount conventions | [defaults](/memory/defaults/) |

## Read/Write Policy

- Before answers that depend on user persona, read memory first with a descriptive semantic query
- Query should describe both topic and preference target, not restate user text verbatim
- When a user reveals a new or changed durable preference, write it to memory as a factual observation
- Do not write raw conversation transcripts into memory
- Read `profile` first for framing; read `defaults` only when execution parameters are needed

## Example Memory Read Queries

- "user risk tolerance and preferred risk framing"
- "trading style and experience level for analysis depth"
- "preferred DeFi products and investment focus"
- "time horizon and participation frequency"

**Why these are MEMORY, not SOUL**: A different user could have low risk tolerance, short-term horizon, and DEX-first preference. The agent's core identity doesn't change - only its output framing does.

**Packaging principle**: Prefer a few pages around 2000 tokens each over many tiny pages, because each additional fetch increases context overhead.
