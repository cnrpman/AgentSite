---
title: Execution
summary: Swap and transfer calls, parameter shapes, defaults, and hard stop conditions.
---
Use this page for swap and transfer setup.

## Primary Tools

| Tool | Signature | Required | Notes |
|------|-----------|----------|-------|
| `searchTokenInfo` | `searchTokenInfo(tokenSymbol?, tokenAddress?, chainId?, holdersLimit?, quoteCurrency?)` | `tokenSymbol + chainId` or `tokenAddress` | resolve symbol-based token input first |
| `ExecuteSwapTool` | `ExecuteSwapTool(chainId?, amount?, fromTokenAddress?, toTokenAddress?)` | none | swap setup |
| `ExecuteTransferTool` | `ExecuteTransferTool(amount?, chainId?, tokenAddress?, receiveAddress?)` | none | transfer setup |

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `chainId` | numeric chain id | `1`, `56` |
| `amount` | amount string | `100`, `0.5` |
| `fromTokenAddress` | EVM contract address | `0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2` |
| `toTokenAddress` | EVM contract address | `0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` |
| `tokenAddress` | EVM contract address | `0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` |
| `receiveAddress` | EVM address or ENS | `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`, `alice.eth` |
| `tokenSymbol` | exact symbol string | `ETH`, `USDC` |

## Defaults

- Default chain is Ethereum (`chainId: 1`) when chain is ambiguous.
- Swap slippage is fixed at `5%`.
- ENS is acceptable where wallet input is allowed.
- If `receiveAddress` is missing, leave it empty; do not guess.

## Rules

### `ExecuteSwapTool`

- The user does not need all parameters upfront.
- Token symbols are not the primary inputs; token addresses are.
- If only symbols are known, resolve them first with `searchTokenInfo`.
- If a token cannot be resolved or a quote cannot be obtained, the tool should return a failure reason.

### `ExecuteTransferTool`

- The user does not need all parameters upfront.
- If only a symbol is known, resolve it first with `searchTokenInfo`.
- Accept wallet addresses and ENS names directly.
- Invalid chain IDs or token addresses should produce a failure reason.

## Output Notes

- `ExecuteSwapTool` returns swap parameters for downstream execution.
- `ExecuteTransferTool` returns transfer parameters in JSON, along with token metadata when available.

## Call Order

| Need | Calls |
|------|-------|
| swap with token addresses already known | `ExecuteSwapTool` |
| transfer with token address already known | `ExecuteTransferTool` |
| swap by symbol | `searchTokenInfo`, then `ExecuteSwapTool` |
| transfer by symbol | `searchTokenInfo`, then `ExecuteTransferTool` |

## Stop Conditions

- Stop after `searchTokenInfo` if the token address still cannot be resolved.
- Do not move into `ExecuteSwapTool` or `ExecuteTransferTool` until required token addresses are clear.

## Do Not

- Do not guess token addresses.
- Do not auto-fill `receiveAddress`.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| swap with addresses | `ExecuteSwapTool(chainId=1, amount='0.5', fromTokenAddress='0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2', toTokenAddress='0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')` |
| transfer with address | `ExecuteTransferTool(amount='100', chainId=1, tokenAddress='0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', receiveAddress='alice.eth')` |
| swap by symbol | `searchTokenInfo(tokenSymbol='ETH', chainId=1)`, then `ExecuteSwapTool(...)` |

## See Also

- [/](/) for the full reference
- [Token](/token/)
- [Wallet](/wallet/)
