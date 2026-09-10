import { createPublicClient, http, parseAbi } from "viem";
import { robinhoodChain } from "./chains";

const FACTORY = "0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB" as const;

export const ponsClient = createPublicClient({
  chain: robinhoodChain,
  transport: http(),
});

const factoryAbi = parseAbi([
  "function getLaunchedToken(address token) view returns ((address token, address deployer, address pairedToken, address positionManager, uint256 positionId, uint256 dexId, uint256 launchConfigId, uint256 restrictionsEndBlock, uint256 supply, bool isToken0, uint24 poolFee, bool exists, uint256 initialBuyAmount) launched)",
  "function graduationStatus(address token) view returns (uint256 pairedPrincipal, uint256 threshold, bool graduated)",
]);

const tokenAbi = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function liquidityPool() view returns (address)",
]);

const poolAbi = parseAbi([
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
]);

export async function lookupToken(tokenAddress: `0x${string}`) {
  const { launched } = await ponsClient.readContract({
    address: FACTORY,
    abi: factoryAbi,
    functionName: "getLaunchedToken",
    args: [tokenAddress],
  });

  if (!launched.exists) return null;

  const [name, symbol, pool, grad] = await Promise.all([
    ponsClient.readContract({ address: tokenAddress, abi: tokenAbi, functionName: "name" }),
    ponsClient.readContract({ address: tokenAddress, abi: tokenAbi, functionName: "symbol" }),
    ponsClient.readContract({ address: tokenAddress, abi: tokenAbi, functionName: "liquidityPool" }),
    ponsClient.readContract({
      address: FACTORY,
      abi: factoryAbi,
      functionName: "graduationStatus",
      args: [tokenAddress],
    }),
  ]);

  const [sqrtPriceX96] = await ponsClient.readContract({
    address: pool,
    abi: poolAbi,
    functionName: "slot0",
  });

  const ratio = Number(sqrtPriceX96) / 2 ** 96;
  const token1PerToken0 = ratio * ratio;
  const priceInWeth = launched.isToken0 ? token1PerToken0 : 1 / token1PerToken0;

  const [pairedPrincipal, threshold, graduated] = grad;
  const progress = threshold > 0n ? Number(pairedPrincipal) / Number(threshold) : 0;

  return { name, symbol, priceInWeth, progress, graduated };
}