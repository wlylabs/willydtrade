"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { shortenAddress } from "@/lib/utils";

export default function SettingsPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isConnected) router.push("/");
  }, [isConnected, router]);

  function copyAddress() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="min-h-[100dvh] pb-20 px-4 pt-6">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-4"
      >
        <p className="text-xs text-neutral-500 mb-1">Wallet</p>
        <div className="flex items-center justify-between">
          <p className="text-sm">{address && shortenAddress(address)}</p>
          <button onClick={copyAddress} className="text-neutral-400">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onClick={() => disconnect()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-red-400"
      >
        <LogOut size={16} />
        Disconnect Wallet
      </motion.button>

      <BottomNav />
    </main>
  );
}