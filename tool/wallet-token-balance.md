# getWalletTokenBalance

**Navigation:** [Home](/) > [tool](/AgentSite/tool/index.md) > [wallet-token-balance](/AgentSite/tool/wallet-token-balance.md)

**Summary:** Multi-mode EVM wallet intelligence for balances, activity timelines, and filtered transaction history.

---

## Purpose

Inspect an EVM wallet through one or more modes: balances, activity, and transactions.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `walletAddress` | string | Yes | Wallet address (`0x...`) or ENS |
| `mode` | array<string> | Yes | One or more of `balance`, `activity`, `transactions` |
| `chainId` | string | Optional | Chain filter, mainly for `balance` mode |

## Modes

| Mode | What it Returns |
|------|-----------------|
| `balance` | Token balances, optionally filtered by chain |
| `activity` | Trimmed activity timeline including transfers and approvals |
| `transactions` | Filtered transaction history with decoded transfers |

## Usage Notes

- No chain filter: get balances across all supported chains
- With `chainId` in `balance` mode: limit balances to one chain
- Combine modes when a single wallet review needs balances plus behavior

## See Also

- [searchTokenInfo](/AgentSite/tool/search-token-info.md) for token metadata on returned balances
- [Runtime Rules](/AgentSite/soul/runtime.md) for chain constraints

Pages that **Backlink** to here:
- [Defaults](/AgentSite/memory/defaults.md)
- [TOOL Layer](/AgentSite/tool/index.md)
