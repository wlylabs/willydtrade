"use client";

import { shortenAddress } from "@/lib/utils";

type Props = {
  conversations: { id: string; peerAddress: string }[];
  onSelect: (id: string) => void;
  activeId: string | null;
};

export default function ChatList({ conversations, onSelect, activeId }: Props) {
  return (
    <div className="w-full sm:w-64 border-r border-white/10 h-full overflow-y-auto">
      {conversations.length === 0 && (
        <p className="text-sm text-neutral-500 p-4">Belum ada percakapan.</p>
      )}
      {conversations.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 ${
            activeId === c.id ? "bg-white/10" : ""
          }`}
        >
          {shortenAddress(c.peerAddress)}
        </button>
      ))}
    </div>
  );
}