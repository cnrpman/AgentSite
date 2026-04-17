---
title: Staking
summary: Pool search and stake execution with the minimum required sequencing.
---
Use this page for pool discovery, staking options, and stake execution.

## Primary Tools

| Tool | Signature | Required | Notes |
|------|-----------|----------|-------|
| `searchPoolInfo` | `searchPoolInfo(chain?, protocol?, token_symbol?, pool_id?)` | none | pool search; returns `pool_id` |
| `ExecuteStakeTool` | `ExecuteStakeTool(pool_id)` | `pool_id` | stake execution |

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `chain` | numeric chain id | `1`, `56` |
| `protocol` | protocol slug or name | `lido`, `aave-v3` |
| `token_symbol` | exact token symbol string | `ETH`, `USDC` |
| `pool_id` | pool id returned by `searchPoolInfo` | `9f4b7a4d-7a7b-4d2e-9a7f-2f71d9d6c123` |

## Output Shape

### `searchPoolInfo`

- `success`: boolean
- `data`: ranked pool results with metadata and historical context
- `error`: failure reason when unavailable

### `ExecuteStakeTool`

- `success`: whether staking initiation succeeded
- `data`: confirmation object with `pool_id` and timestamp when successful
- `error`: failure reason when unsuccessful

## Rules

- Use `searchPoolInfo` as the primary source for pool data.
- `searchPoolInfo` returns the `pool_id` needed by `ExecuteStakeTool`.
- `ExecuteStakeTool` is for execution, not discovery.

## Call Order

| Need | Calls |
|------|-------|
| pool search | `searchPoolInfo` |
| staking execution | `searchPoolInfo`, then `ExecuteStakeTool(pool_id)` |

## Stop Conditions

- Stop after `searchPoolInfo` if the user is still comparing pools.
- Call `ExecuteStakeTool` only after a specific `pool_id` has been chosen.

## Do Not

- Do not guess `pool_id`.
- Do not call `ExecuteStakeTool` before pool selection.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| find ETH pools | `searchPoolInfo(chain=1, token_symbol='ETH')` |
| stake selected pool | `ExecuteStakeTool(pool_id='9f4b7a4d-7a7b-4d2e-9a7f-2f71d9d6c123')` |

## See Also

- [/](/) for the full reference
- [Wallet](/wallet/)
