"use client";

import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { robinhoodChain } from "@/lib/chains";
import { shortenAddress } from "@/lib/utils";

export default function BalancePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { data: balance, isLoading } = useBalance({
    address,
    chainId: robinhoodChain.id,
  });

  useEffect(() => {
    if (!isConnected) router.push("/");
  }, [isConnected, router]);

  return (
    <main className="min-h-[100dvh] pb-20 px-4 pt-6">
      <h1 className="text-xl font-semibold mb-4">Balance</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
      >
        <p className="text-sm text-neutral-400 mb-1">
          {address && shortenAddress(address)}
        </p>
        <p className="text-3xl font-semibold mt-2">
          {isLoading
            ? "..."
            : `${Number(balance?.formatted ?? 0).toFixed(4)} ${balance?.symbol ?? "ETH"}`}
        </p>
        <p className="text-xs text-neutral-500 mt-1">Robinhood Chain</p>

        {address && (
          <a
            href={`https://robinhoodchain.blockscout.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-accent"
          >
            Lihat di Explorer
            <ExternalLink size={14} />
          </a>
        )}
      </motion.div>

      <BottomNav />
    </main>
  );
}