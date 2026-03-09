# searchPoolInfo

**Navigation:** [Home](/) > [tool](/AgentSite/tool/) > [search-pool-info](/AgentSite/tool/search-pool-info/)

**Summary:** Retrieve staking and yield pools with scoring, recent APY or TVL trends, and DeFi-oriented interpretation.

---

## Purpose

Retrieve ranked pool data for staking and yield analysis, including scoring, recent APY or TVL trends, and pool metadata.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `chain` | integer | Optional | Supported values: `1` for Ethereum, `56` for BSC |
| `protocol` | string | Optional | Protocol slug such as `lido` or `aave-v3` |
| `token_symbol` | string | Optional | Token filter such as `ETH` or `USDC` |
| `pool_id` | string | Optional | Specific pool identifier |

## Output Shape

- `success`: boolean
- `data`: ranked pool results with metadata and historical context
- `error`: failure reason when unavailable

## Rules

- ALWAYS use this as the PRIMARY source for pool data
- Only after calling searchPoolInfo should you supplement with [webSearch](/AgentSite/tool/web-search/) or [searchTwitter](/AgentSite/tool/search-twitter/)
- Returns pool_id values needed for ExecuteStakeTool

## Integration

When staking execution is the intent:
1. Call searchPoolInfo to get pool information and pool_id
2. IMMEDIATELY call ExecuteStakeTool with the pool_id

## See Also

- [Execute Stake](/AgentSite/tool/execute-stake/) for staking execution
- [User Profile](/AgentSite/memory/profile/) for staking-first output shaping

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/)
