import { Address } from "viem";

export const MAINNET_TOKENS: { symbol: string; address: Address }[] = [
  { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address },
  { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address },
  { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address },
];
