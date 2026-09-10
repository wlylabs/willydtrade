"use client";
import { motion } from "motion/react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold tracking-tight"
      >
        Nexa Chain
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 text-lg text-neutral-400 max-w-xl"
      >
        The next-generation Web3 platform for seamless on-chain experiences.
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-6 py-3 rounded-full bg-accent text-white font-medium"
      >
        Connect Wallet
      </motion.button>
    </main>
  );
}