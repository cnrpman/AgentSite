---
title: Wallet Intelligence Tool
summary: Get wallet balances, activity, and transactions.
---
**Tool ID:** `getWalletTokenBalance`

## Purpose
Return token balances, activity timelines, and transaction history for an EVM wallet.

## Use This When
- You need portfolio balances for an address or ENS name.
- You want recent transfers or approvals.
- You need a summarized transaction history.

## Input
Required fields:
- `walletAddress`: Wallet address or ENS (e.g. `0x...`, `vitalik.eth`).
- `mode`: Array containing one or more of `balance`, `activity`, `transactions`.

Optional fields:
- `chainId`: Filter balances to a single chain (used only for `balance`).

Validation rules:
- `walletAddress` must be a valid address or resolvable ENS name.

## Output
- `success`: Boolean.
- `data`: Object keyed by requested modes.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "getWalletTokenBalance",
  "arguments": {
    "walletAddress": "vitalik.eth",
    "mode": ["balance", "activity"],
    "chainId": "1"
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": {
    "balance": [{ "symbol": "ETH", "amount": "12.34" }],
    "activity": [{ "type": "transfer", "hash": "0x..." }]
  }
}
```

## See also
- [Search Token Info](/docs/agent/tools/search-token/)
- [Search Pool Info](/docs/agent/tools/search-pool-info/)
