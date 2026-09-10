"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Message = {
  id: string;
  senderAddress: string;
  content: string;
  sentAt: Date;
};

type Props = {
  myAddress: string;
  peerAddress: string;
  messages: Message[];
  onSend: (text: string) => Promise<void>;
};

export default function ChatWindow({ myAddress, peerAddress, messages, onSend }: Props) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!text.trim()) return;
    await onSend(text.trim());
    setText("");
  }

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMine = m.senderAddress.toLowerCase() === myAddress.toLowerCase();
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                isMine
                  ? "ml-auto bg-accent text-white"
                  : "mr-auto bg-white/10 text-white"
              }`}
            >
              {m.content}
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Message ${peerAddress.slice(0, 6)}...`}
          className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm outline-none border border-white/10"
        />
        <button
          onClick={handleSend}
          className="px-5 py-2 rounded-full bg-accent text-white text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}