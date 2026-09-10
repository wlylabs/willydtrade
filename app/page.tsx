"use client";

import { motion } from "motion/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) router.push("/chat");
  }, [isConnected, router]);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight"
      >
        Nexa Chain
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 text-base sm:text-lg text-neutral-400 max-w-xl"
      >
        Encrypted messaging, wallet to wallet. No phone number, no email — just your address.
      </motion.p>
      <div className="mt-8">
        <ConnectButton />
      </div>
    </main>
  );
}