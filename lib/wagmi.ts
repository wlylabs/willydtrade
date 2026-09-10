import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base } from "wagmi/chains";
import { robinhoodChain } from "./chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Nexa Chain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [robinhoodChain, mainnet, base],
  ssr: true,
});