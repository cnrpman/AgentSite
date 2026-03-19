# ExecuteStakeTool

**Navigation:** [Home](/) > [tool](/AgentSite/tool/index.md) > [execute-stake](/AgentSite/tool/execute-stake.md)

**Summary:** Initiate staking for a specific pool using its `pool_id`.

---

## Purpose

Initiate a staking operation for a specific pool.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `pool_id` | string | Yes | UUID of the pool returned by `searchPoolInfo` |

## Output Shape

- `success`: whether staking initiation succeeded
- `data`: confirmation object with `pool_id` and timestamp when successful
- `error`: failure reason when unsuccessful

## Workflow

1. Use [searchPoolInfo](/AgentSite/tool/search-pool-info.md) to identify the target pool
2. Pass the selected `pool_id` into `ExecuteStakeTool`
3. Return the tool result directly

## Usage Notes

- This tool is for execution, not discovery
- If the user is still comparing pools, stay in [searchPoolInfo](/AgentSite/tool/search-pool-info.md)
- Use the exact `pool_id` returned by pool search

## See Also

- [Search Pool Info](/AgentSite/tool/search-pool-info.md) for pool discovery

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/index.md)
