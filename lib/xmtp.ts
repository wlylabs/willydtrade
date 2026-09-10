import { toBytes } from "viem";
import type { WalletClient } from "viem";
import { IdentifierKind, type Signer } from "@xmtp/browser-sdk";

// Adapter: ubah wagmi/viem WalletClient jadi Signer yang dipahami XMTP
export function walletClientToXmtpSigner(walletClient: WalletClient): Signer {
  const account = walletClient.account;
  if (!account) throw new Error("Wallet belum connect");

  const address = account.address.toLowerCase() as `0x${string}`;

  return {
    type: "EOA",
    getIdentifier: () => ({
      identifier: address,
      identifierKind: IdentifierKind.Ethereum,
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