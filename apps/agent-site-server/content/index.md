---
title: Tool Reference
summary: Full tool signatures, scene-page entry points, defaults, and stop conditions.
---
Use this page for tool signatures and invocation order.

## Scene Pages

If a request clearly matches one scene below, open that page first. Each scene page repeats the signatures, parameter shapes, call order, and stop conditions it needs.

| Scene | Open | Main tools |
|-------|------|------------|
| token lookup and token diligence | [Token](/token/) | `searchTokenInfo`, `projectTool`, `searchTwitter`, `webSearch` |
| project review | [Project](/project/) | `projectTool`, `searchTwitter`, `webSearch`, `searchTokenInfo` |
| protocol or chain review | [Protocol & Chain](/protocol-chain/) | `protocolTool`, `chainTool`, `webSearch` |
| market pulse, trends, social, news | [Market Signal](/market-signal/) | `getTrendingInsights`, `searchTwitter`, `webSearch`, `chainTool` |
| wallet review | [Wallet](/wallet/) | `getWalletTokenBalance`, `searchTokenInfo` |
| pool search and staking | [Staking](/staking/) | `searchPoolInfo`, `ExecuteStakeTool` |
| swap or transfer | [Execution](/execution/) | `searchTokenInfo`, `ExecuteSwapTool`, `ExecuteTransferTool` |
| alert creation | [Alert](/alert/) | `searchTokenInfo`, `setupAlert` |

## Global Rules

- If a tool can retrieve the needed data, use the tool instead of asking the user.
- Treat user text as candidate parameters until the relevant tool validates them.
- Use `searchTokenInfo` for token price, contract address, and symbol-based resolution.
- If tool B depends on output from tool A, call A first and then call B.
- Preserve exact token symbols and addresses.

## Call Order

| Pattern | Rule |
|---------|------|
| independent tool calls | run in the same round |
| tool B depends on output from tool A | run sequentially in separate rounds |
| symbol-based swap or transfer | `searchTokenInfo` first, then execution tool |
| staking | `searchPoolInfo` first, then `ExecuteStakeTool` |
| alert setup | `searchTokenInfo` first, then `setupAlert` |

## Tool Signatures

| Tool | Signature | Required | Notes |
|------|-----------|----------|-------|
| `searchTokenInfo` | `searchTokenInfo(tokenSymbol?, tokenAddress?, chainId?, holdersLimit?, quoteCurrency?)` | `tokenSymbol + chainId` or `tokenAddress` | price, contract, metadata, symbol resolution |
| `projectTool` | `projectTool(projectName)` | `projectName` | project context and valuation expectations |
| `chainTool` | `chainTool(chainId?, chainName?)` | `chainId` or `chainName` | chain-level activity and ranking |
| `protocolTool` | `protocolTool(protocol)` | `protocol` | protocol-level TVL, fees, revenue, capital flow |
| `getTrendingInsights` | `getTrendingInsights(sections?, convert?, timeFrame?, gainersLosersLimit?, communityTopicsLimit?, communityTokensLimit?, duneChain?, duneContractsLimit?)` | none | trend scan |
| `searchTwitter` | `searchTwitter(query)` | `query` | sentiment and discussion scan |
| `webSearch` | `webSearch(query)` | `query` | official-source and live web validation |
| `getWalletTokenBalance` | `getWalletTokenBalance(walletAddress, mode[], chainId?)` | `walletAddress`, `mode` | `mode` includes `balance`, `activity`, `transactions` |
| `searchPoolInfo` | `searchPoolInfo(chain?, protocol?, token_symbol?, pool_id?)` | none | pool discovery; returns `pool_id` |
| `ExecuteStakeTool` | `ExecuteStakeTool(pool_id)` | `pool_id` | call after pool selection |
| `ExecuteSwapTool` | `ExecuteSwapTool(chainId?, amount?, fromTokenAddress?, toTokenAddress?)` | none | resolve symbols with `searchTokenInfo` first if needed |
| `ExecuteTransferTool` | `ExecuteTransferTool(amount?, chainId?, tokenAddress?, receiveAddress?)` | none | resolve symbols with `searchTokenInfo` first if needed |
| `setupAlert` | `setupAlert(alertType, userIntent)` | `alertType=price`, `userIntent` | `userIntent` must include current price |

## Parameter Shapes

| Parameter | Expected shape | Example |
|-----------|----------------|---------|
| `tokenSymbol` | exact token symbol string | `BTC`, `ETH`, `USDC` |
| `tokenAddress` | EVM contract address | `0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` |
| `chainId` | numeric chain id | `1`, `56` |
| `chainName` | chain name string | `Ethereum`, `BNB Chain` |
| `projectName` | project or token name string | `Bitcoin`, `Ethereum`, `Zama` |
| `protocol` | protocol slug or name | `aave-v3`, `uniswap` |
| `walletAddress` | EVM address or ENS | `0x3c11992f1d064e4751ce3bf603491d95ed6e8090`, `vitalik.eth` |
| `mode[]` | array of wallet query modes | `['balance']`, `['balance', 'activity']` |
| `sections[]` | array of trend sections | `['gainers', 'losers']`, `['communityTopics']` |
| `timeFrame` | short time window string | `24h`, `7d` |
| `amount` | amount string | `100`, `0.5` |
| `holdersLimit` | integer | `10`, `50` |
| `quoteCurrency` | quote asset string | `USDT`, `USD` |
| `receiveAddress` | recipient address or ENS | `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`, `alice.eth` |
| `pool_id` | pool identifier returned by `searchPoolInfo` | `9f4b7a4d-7a7b-4d2e-9a7f-2f71d9d6c123` |
| `alertType` | fixed alert type string | `price` |
| `userIntent` | plain sentence with current price included | `BTC is currently $95000. Alert me when it drops 5%.` |

## Minimal Examples

| Tool | Example call |
|------|--------------|
| `searchTokenInfo` | `searchTokenInfo(tokenSymbol='ETH', chainId=1)` |
| `projectTool` | `projectTool(projectName='Ethereum')` |
| `getWalletTokenBalance` | `getWalletTokenBalance(walletAddress='vitalik.eth', mode=['balance', 'activity'])` |
| `searchPoolInfo` | `searchPoolInfo(chain=1, token_symbol='ETH')` |
| `ExecuteSwapTool` | `ExecuteSwapTool(chainId=1, amount='0.5', fromTokenAddress='0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2', toTokenAddress='0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')` |
| `ExecuteTransferTool` | `ExecuteTransferTool(amount='100', chainId=1, tokenAddress='0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', receiveAddress='alice.eth')` |
| `setupAlert` | `setupAlert(alertType='price', userIntent='BTC is currently $95000. Alert me when it drops 5%.')` |

## Defaults That Affect Calls

| Topic | Rule |
|-------|------|
| default wallet | `0x3c11992f1d064e4751ce3bf603491d95ed6e8090` when the user means "my wallet" and gives no address |
| default chain | Ethereum (`chainId: 1`) when chain is ambiguous |
| swap slippage | fixed at `5%` |
| ENS | accept directly where wallet input is allowed |
| missing transfer recipient | leave `receiveAddress` empty; do not guess |

## Common Sequences

| Goal | Calls |
|------|-------|
| token lookup | `searchTokenInfo` |
| token due diligence | `searchTokenInfo` + `projectTool` + `searchTwitter` + `webSearch` |
| protocol review | `protocolTool` + `chainTool` + `webSearch` |
| trend scan | `getTrendingInsights` + `chainTool` + `searchTwitter` |
| wallet review | `getWalletTokenBalance`, then `searchTokenInfo` if needed |
| staking | `searchPoolInfo`, then `ExecuteStakeTool(pool_id)` |
| swap by symbol | `searchTokenInfo`, then `ExecuteSwapTool` |
| transfer by symbol | `searchTokenInfo`, then `ExecuteTransferTool` |
| price alert | `searchTokenInfo`, then `setupAlert` |

## Minimal Failure Rules

- If a symbol cannot be resolved, do not guess the token address.
- If a swap or transfer still lacks a token address, stop after `searchTokenInfo`.
- If staking has no `pool_id`, stay in `searchPoolInfo`.
- If an alert request has no current price embedded in `userIntent`, fetch price first and then call `setupAlert`.

## See Also

- [Token](/token/)
- [Project](/project/)
- [Protocol & Chain](/protocol-chain/)
- [Market Signal](/market-signal/)
- [Wallet](/wallet/)
- [Staking](/staking/)
- [Execution](/execution/)
- [Alert](/alert/)
