# Wallet

**Navigation:** [Home](/) > [wallet](/AgentSite/wallet.md)

**Summary:** Wallet review with mode selection, address shapes, and token follow-up.

---

Use this page for wallet balances, activity, and transactions.

## Primary Tool

| Tool | Signature | Required | Notes |
|------|-----------|----------|-------|
| `getWalletTokenBalance` | `getWalletTokenBalance(walletAddress, mode[], chainId?)` | `walletAddress`, `mode` | wallet review tool |

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `walletAddress` | EVM address or ENS | `0x3c11992f1d064e4751ce3bf603491d95ed6e8090`, `vitalik.eth` |
| `mode[]` | wallet query mode array | `['balance']`, `['balance', 'activity']`, `['transactions']` |
| `chainId` | numeric chain id | `1`, `56` |

## Mode Selection

| Need | `mode` |
|------|--------|
| current holdings | `['balance']` |
| behavior summary | `['activity']` |
| transaction history | `['transactions']` |
| full review | `['balance', 'activity']` |

## Mode Output

| Mode | What it returns |
|------|-----------------|
| `balance` | token balances, optionally filtered by chain |
| `activity` | trimmed activity timeline including transfers and approvals |
| `transactions` | filtered transaction history with decoded transfers |

## Follow-Up Tool

| Tool | Signature | Use when |
|------|-----------|----------|
| `searchTokenInfo` | `searchTokenInfo(tokenSymbol?, tokenAddress?, chainId?, holdersLimit?, quoteCurrency?)` | returned balances need token metadata or price |

## Defaults

- If the user clearly means "my wallet" and provides no address, use `0x3c11992f1d064e4751ce3bf603491d95ed6e8090`.
- If chain is ambiguous, Ethereum (`chainId: 1`) is the default.

## Usage Notes

- No chain filter: get balances across all supported chains.
- With `chainId` in `balance` mode: limit balances to one chain.
- Combine modes when a single wallet review needs balances plus behavior.

## Call Order

| Need | Calls |
|------|-------|
| wallet balances | `getWalletTokenBalance` |
| wallet review with token metadata | `getWalletTokenBalance`, then `searchTokenInfo` for specific assets |

## Stop Conditions

- Stop after `getWalletTokenBalance` if balances, activity, or transactions already answer the question.
- Add `searchTokenInfo` only for assets that need token metadata or price.

## Do Not

- Do not jump to swap, transfer, or staking tools before the wallet state is clear.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| balances | `getWalletTokenBalance(walletAddress='vitalik.eth', mode=['balance'])` |
| full review | `getWalletTokenBalance(walletAddress='vitalik.eth', mode=['balance', 'activity'])` |

## See Also

- [Execution](/AgentSite/execution.md)
- [Staking](/AgentSite/staking.md)

Pages that **Backlink** to here:
- [Tool Reference](/)
