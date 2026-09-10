"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Client } from "@xmtp/browser-sdk";
import { walletClientToXmtpSigner } from "@/lib/xmtp";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { shortenAddress } from "@/lib/utils";

export default function ChatPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [conversations, setConversations] = useState<
    { id: string; peerAddress: string }[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newPeer, setNewPeer] = useState("");
  const [loading, setLoading] = useState(false);

  // Init XMTP client sekali wallet connect
  useEffect(() => {
    if (!walletClient || !address) return;
    (async () => {
      setLoading(true);
      try {
        const signer = walletClientToXmtpSigner(walletClient);
        const client = await Client.create(signer, { env: "production" });
        setXmtpClient(client);

        const convos = await client.conversations.list();
        setConversations(
          convos.map((c: any) => ({
            id: c.id,
            peerAddress: c.peerAddress ?? "unknown",
          }))
        );
      } catch (err) {
        console.error("XMTP init error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [walletClient, address]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!xmtpClient) return;
      const convo = (await xmtpClient.conversations.list()).find(
        (c: any) => c.id === conversationId
      );
      if (!convo) return;
      const msgs = await (convo as any).messages();
      setMessages(
        msgs.map((m: any) => ({
          id: m.id,
          senderAddress: m.senderAddress,
          content: m.content,
          sentAt: m.sentAt,
        }))
      );
      setActiveId(conversationId);
    },
    [xmtpClient]
  );

  async function handleSend(text: string) {
    if (!xmtpClient || !activeId) return;
    const convo = (await xmtpClient.conversations.list()).find(
      (c: any) => c.id === activeId
    );
    if (!convo) return;
    await (convo as any).send(text);
    loadMessages(activeId);
  }

  async function startNewChat() {
    if (!xmtpClient || !newPeer.trim()) return;
    try {
      const convo = await xmtpClient.conversations.newDm(newPeer.trim());
      setConversations((prev) => [
        ...prev,
        { id: (convo as any).id, peerAddress: newPeer.trim() },
      ]);
      setNewPeer("");
      loadMessages((convo as any).id);
    } catch (err) {
      alert("Alamat wallet tidak valid atau belum aktif di XMTP.");
      console.error(err);
    }
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-400">Connect wallet dulu di halaman utama.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="p-4 border-b border-white/10 flex justify-between items-center">
        <h1 className="font-semibold">Nexa Chain</h1>
        <span className="text-sm text-neutral-400">
          {address && shortenAddress(address)}
        </span>
      </header>

      <div className="p-4 border-b border-white/10 flex gap-2">
        <input
          value={newPeer}
          onChange={(e) => setNewPeer(e.target.value)}
          placeholder="Mulai chat baru: masukkan alamat wallet 0x..."
          className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm outline-none border border-white/10"
        />
        <button
          onClick={startNewChat}
          className="px-5 py-2 rounded-full bg-accent text-white text-sm font-medium"
        >
          Start
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ChatList
          conversations={conversations}
          onSelect={loadMessages}
          activeId={activeId}
        />
        {activeId ? (
          <ChatWindow
            myAddress={address!}
            peerAddress={
              conversations.find((c) => c.id === activeId)?.peerAddress ?? ""
            }
            messages={messages}
            onSend={handleSend}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">
            {loading ? "Menyiapkan XMTP..." : "Pilih atau mulai percakapan"}
          </div>
        )}
      </div>
    </main>
  );
}