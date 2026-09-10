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

  const [xmtpClient, setXmtpClient] = useState<Client<any> | null>(null);
  const [conversations, setConversations] = useState<
    { id: string; peerAddress: string }[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newPeer, setNewPeer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    if (!walletClient || !address) return;
    (async () => {
      setLoading(true);
      try {
        const signer = walletClientToXmtpSigner(walletClient);
        const client = await Client.create(signer, {
          env: "production",
        } as Parameters<typeof Client.create>[1]);
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
      const convo = await (xmtpClient.conversations as any).newDm(
        newPeer.trim()
      );
      setConversations((prev) => [
        ...prev,
        { id: (convo as any).id, peerAddress: newPeer.trim() },
      ]);
      setNewPeer("");
      setShowComposer(false);
      loadMessages((convo as any).id);
    } catch (err) {
      alert("Alamat wallet tidak valid atau belum aktif di XMTP.");
      console.error(err);
    }
  }

  if (!isConnected) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-6 text-center">
        <p className="text-neutral-400 text-sm">
          Connect wallet dulu di halaman utama.
        </p>
      </main>
    );
  }

  const showList = !activeId;

  return (
    <main className="h-[100dvh] flex flex-col overflow-hidden">
      <header className="px-4 py-3 border-b border-white/10 flex justify-between items-center shrink-0">
        <h1 className="font-semibold text-base">Nexa Chain</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400 hidden sm:inline">
            {address && shortenAddress(address)}
          </span>
          <button
            onClick={() => setShowComposer((v) => !v)}
            className="text-sm px-3 py-1.5 rounded-full bg-accent text-white font-medium"
          >
            New
          </button>
        </div>
      </header>

      {showComposer && (
        <div className="p-3 border-b border-white/10 flex gap-2 shrink-0">
          <input
            value={newPeer}
            onChange={(e) => setNewPeer(e.target.value)}
            placeholder="Wallet address 0x..."
            className="flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none border border-white/10"
          />
          <button
            onClick={startNewChat}
            className="px-4 py-2.5 rounded-full bg-accent text-white text-sm font-medium shrink-0"
          >
            Start
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className={`${showList ? "block" : "hidden"} sm:block w-full sm:w-auto h-full`}>
          <ChatList
            conversations={conversations}
            onSelect={loadMessages}
            activeId={activeId}
          />
        </div>

        <div className={`${showList ? "hidden" : "flex"} sm:flex flex-1 min-w-0 h-full`}>
          {activeId ? (
            <ChatWindow
              myAddress={address!}
              peerAddress={
                conversations.find((c) => c.id === activeId)?.peerAddress ?? ""
              }
              messages={messages}
              onSend={handleSend}
              onBack={() => setActiveId(null)}
            />
          ) : (
            <div className="flex-1 items-center justify-center text-neutral-500 text-sm hidden sm:flex">
              {loading ? "Menyiapkan XMTP..." : "Pilih atau mulai percakapan"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}