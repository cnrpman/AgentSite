---
title: protocolTool
summary: Retrieve DeFi protocol information in markdown format with TVL, fees, revenue, and capital-flow analysis.
---
## Purpose

Retrieve a protocol-focused analysis covering TVL, fees, revenue, and capital flows.

## Endpoint

`/protocol/analysis`

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `protocol` | string | Expected | Protocol name or ID such as `aave-v3` or `uniswap` |

## Use Rules

- `protocol` is required
- Always call the remote endpoint above for protocol analysis
- Build request parameters from user intent; do not hardcode values

## When to Call

- Protocol due diligence
- TVL or fee trend review
- Revenue quality checks
- Capital-flow interpretation

## Output

Returns a markdown-formatted protocol analysis intended for direct downstream use.

## See Also

- [chainTool](/tool/chain-tool/) for chain context
- [projectTool](/tool/project-tool/) for project-level metadata and sentiment
- [webSearch](/tool/web-search/) for official-source verification
