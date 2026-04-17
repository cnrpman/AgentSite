---
title: Protocol & Chain
summary: Protocol-level and chain-level review with the minimum tool choice logic.
---
Use this page for protocol review, chain review, and protocol-versus-chain context.

## Primary Tools

| Tool | Signature | Required | Use when |
|------|-----------|----------|----------|
| `protocolTool` | `protocolTool(protocol)` | `protocol` | the subject is a named protocol |
| `chainTool` | `chainTool(chainId?, chainName?)` | `chainId` or `chainName` | the subject is a chain, ecosystem, or chain rotation question |

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `protocol` | protocol slug or name | `aave-v3`, `uniswap` |
| `chainId` | numeric chain id | `1`, `56` |
| `chainName` | chain name string | `Ethereum`, `BNB Chain` |

- At least one of `chainId` or `chainName` must be provided for `chainTool`.
- If `chainId` is provided, it can be mapped to `chainName`.

## Endpoint Mapping

| Tool | Endpoint | Rule |
|------|----------|------|
| `protocolTool` | `/protocol/analysis` | pass the protocol slug or name directly and build parameters from user intent |
| `chainTool` | `/chain/analysis` | pass `chainId` or `chainName`; do not hardcode values |

## Follow-Up Tool

| Tool | Signature | Use when |
|------|-----------|----------|
| `webSearch` | `webSearch(query)` | official-source or live external confirmation is needed |

## When To Call

### `protocolTool`

- Protocol due diligence
- TVL or fee trend review
- Revenue quality checks
- Capital-flow interpretation

### `chainTool`

- Chain comparison
- DEX activity review
- TVL trend review
- Protocol dominance analysis
- Trading-pattern scans at the chain level

Use `webSearch` only after tool output when official-source confirmation or live external context is still required.

## Output Notes

- `protocolTool` returns a markdown-formatted protocol analysis intended for direct downstream use.
- `chainTool` returns chain-level activity and ranking analysis.

## Call Order

| Need | Calls |
|------|-------|
| protocol review | `protocolTool` |
| chain review | `chainTool` |
| protocol with chain context | `protocolTool`, then `chainTool` |
| chain with external confirmation | `chainTool`, then `webSearch` |
| protocol with external confirmation | `protocolTool`, then `webSearch` |

## Stop Conditions

- Stop after `protocolTool` if the answer only needs protocol-level TVL, fees, revenue, or capital-flow context.
- Stop after `chainTool` if the answer only needs chain-level activity and ranking.
- Add `webSearch` only when external confirmation matters.

## Do Not

- Do not start with `webSearch` for a straightforward protocol or chain review.
- Do not use `chainTool` as a substitute for a named protocol question.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| protocol review | `protocolTool(protocol='aave-v3')` |
| chain review | `chainTool(chainId=1)` |
| chain review by name | `chainTool(chainName='Ethereum')` |

## See Also

- [Market Signal](/market-signal/)
