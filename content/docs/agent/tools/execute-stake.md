---
title: Execute Stake Tool
summary: Initiate staking for a specific pool.
---
**Tool ID:** `ExecuteStakeTool`

## Purpose
Start a staking action for a yield pool by pool ID.

## Use This When
- You have a pool ID from Search Pool Info.
- You want to initiate staking or yield farming.

## Input
Required fields:
- `pool_id`: UUID of the pool to stake in.

## Output
- `success`: Boolean.
- `action`: Always `chat-stake` on success.
- `data`: Confirmation payload with `pool_id`.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "ExecuteStakeTool",
  "arguments": {
    "pool_id": "aab39a8c-9722-40d9-a539-0608e38e889d"
  }
}
```

## Example Response
```json
{
  "success": true,
  "action": "chat-stake",
  "data": {
    "pool_id": "aab39a8c-9722-40d9-a539-0608e38e889d"
  }
}
```

## See also
- [Search Pool Info](/docs/agent/tools/search-pool-info/)
- [Execute Transfer](/docs/agent/tools/execute-transfer/)
