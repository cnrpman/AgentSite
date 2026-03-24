# Defaults

**Navigation:** [Home](/) > [memory](/AgentSite/memory/index.md) > [defaults](/AgentSite/memory/defaults.md)

**Summary:** Default wallet address, chain, and operational conventions for this user.

---

## Default Wallet

`0x3c11992f1d064e4751ce3bf603491d95ed6e8090`

- Use when wallet address is not explicitly provided
- If user asks about their wallet address, disclose this address
- For explicit self-transfers, use this address as receiveAddress

## Default Chain

Ethereum (chainId: 1) when chain is ambiguous. Try all supported chains if unclear.

## Operational Conventions

- Slippage for swaps is FIXED at 5%; override any other value
- Accept ENS addresses (e.g., vitalik.eth); pass directly without resolution
- If receiveAddress is omitted in transfers, proceed with empty receiveAddress; do NOT guess or auto-fill

## See Also

- [Runtime Rules](/AgentSite/runtime/index.md) for chain limitations
- [Wallet Token Balance Tool](/AgentSite/tool/wallet-token-balance.md) for balance queries

Pages that **Backlink** to here:
- [MEMORY Layer](/AgentSite/memory/index.md)
- [User Profile](/AgentSite/memory/profile.md)
