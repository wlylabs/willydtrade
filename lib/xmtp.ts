import { toBytes } from "viem";
import type { WalletClient } from "viem";
import type { Signer } from "@xmtp/browser-sdk";

// Adapter: ubah wagmi/viem WalletClient jadi Signer yang dipahami XMTP
export function walletClientToXmtpSigner(walletClient: WalletClient): Signer {
  const account = walletClient.account;
  if (!account) throw new Error("Wallet belum connect");

  return {
    type: "EOA",
    getIdentifier: () => ({
      identifier: account.address.toLowerCase(),
      identifierKind: "Ethereum",
    }),
    signMessage: async (message: string) => {
      const signature = await walletClient.signMessage({
        account,
        message,
      });
      return toBytes(signature);
    },
  };
}