"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, Search, Rocket } from "lucide-react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { lookupToken } from "@/lib/pons";

export default function LaunchPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isConnected) router.push("/");
  }, [isConnected, router]);

  async function handleLookup() {
    setError("");
    setResult(null);
    if (!address.startsWith("0x") || address.length !== 42) {
      setError("Alamat token tidak valid.");
      return;
    }
    setLoading(true);
    try {
      const data = await lookupToken(address as `0x${string}`);
      if (!data) setError("Token ini belum pernah di-launch lewat Pons.");
      else setResult(data);
    } catch (err) {
      console.error(err);
      setError("Gagal ambil data token. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] pb-20 px-4 pt-6">
      <h1 className="text-xl font-semibold mb-4">Launch</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Rocket size={18} className="text-accent" />
          <h2 className="font-medium">Launch token baru</h2>
        </div>
        <p className="text-sm text-neutral-400 mb-4">
          Buka halaman resmi Pons untuk membuat token baru. Wallet kamu tetap yang menandatangani transaksinya.
        </p>
        <a
          href="https://www.ponsfamily.com/launchpad/create"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-accent text-white text-sm font-medium"
        >
          Buka Pons Create
          <ExternalLink size={16} />
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-4"
      >
        <h2 className="font-medium mb-2">Jelajahi launch yang ada</h2>
        <p className="text-sm text-neutral-400 mb-4">
          Lihat token-token yang sudah di-launch di Pons.
        </p>
        <a
          href="https://www.ponsfamily.com/launchpad"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white/10 text-white text-sm font-medium"
        >
          Buka Explore Pons
          <ExternalLink size={16} />
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <h2 className="font-medium mb-3">Cek token</h2>
        <div className="flex gap-2 mb-3">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat token 0x..."
            className="flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none border border-white/10"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="px-4 py-2.5 rounded-full bg-accent text-white text-sm font-medium shrink-0 disabled:opacity-60"
          >
            {loading ? "..." : <Search size={16} />}
          </button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {result && (
          <div className="mt-2 space-y-2 text-sm">
            <p className="font-medium">
              {result.name} ({result.symbol})
            </p>
            <p className="text-neutral-400">
              Harga: {result.priceInWeth.toFixed(10)} ETH
            </p>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-accent"
                style={{ width: `${Math.min(result.progress * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500">
              {result.graduated
                ? "Sudah graduate"
                : `${(result.progress * 100).toFixed(1)}% menuju graduation`}
            </p>
          </div>
        )}
      </motion.div>

      <BottomNav />
    </main>
  );
}