"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, MessageCircle, Wallet, Settings } from "lucide-react";

const items = [
  { href: "/launch", label: "Launch", icon: Rocket },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/balance", label: "Balance", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 flex border-t border-white/10 bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const active = pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs ${
              active ? "text-accent" : "text-neutral-500"
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}