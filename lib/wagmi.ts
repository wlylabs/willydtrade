import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base, polygon } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Nexa Chain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, base, polygon],
  ssr: true,
});