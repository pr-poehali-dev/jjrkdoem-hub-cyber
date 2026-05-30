import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { User, Message, Chat } from "../types";

interface MessagesPageProps {
  user: User;
  openChatWith?: { seller: string; product: string } | null;
}

type ChatMap = Record<string, Message[]>;

const INITIAL_MESSAGES: ChatMap = {};

export default function MessagesPage({ user, openChatWith }: MessagesPageProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<ChatMap>(INITIAL_MESSAGES);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // При переходе "Написать продавцу" — находим или создаём чат
  useEffect(() => {
    if (!openChatWith) {
      setActiveChat(chats[0]?.id ?? null);
      return;
    }

    const { product } = openChatWith;
    const adminName = "ADMINISTRATOR CONSOLE";

    // Ищем существующий чат с админом
    const existing = chats.find((c) => c.username === adminName);
    if (existing) {
      // Обновляем товар в чате если другой
      setChats((prev) =>
        prev.map((c) => c.username === adminName ? { ...c, product } : c)
      );
      setActiveChat(existing.id);
      return;
    }

    // Создаём новый чат с ADMINISTRATOR CONSOLE
    const newId = `new_${Date.now()}`;
    const newChat: Chat = {
      id: newId,
      username: adminName,
      avatar: "",
      lastMessage: "",
      time: "Сейчас",
      unread: 0,
      product,
    };
    const greeting: Message = {
      id: "greet_1",
      from: user.username,
      text: `Привет! Меня интересует твой товар: ${product}`,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };

    setChats((prev) => [newChat, ...prev]);
    setMessages((prev) => ({ ...prev, [newId]: [greeting] }));
    setActiveChat(newId);
  }, [openChatWith]);

  // Скролл вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    const msg: Message = {
      id: Date.now().toString(),
      from: user.username,
      text: input.trim(),
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), msg],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat ? { ...c, lastMessage: msg.text, time: msg.time } : c
      )
    );
    setInput("");
  };

  const activeChatData = chats.find((c) => c.id === activeChat);
  const chatMessages = activeChat ? (messages[activeChat] || []) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-px" style={{ background: "var(--neon-cyan)" }} />
        <span className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>// USER.MESSAGES</span>
      </div>

      <div
        className="flex overflow-hidden"
        style={{
          border: "1px solid rgba(0,245,255,0.2)",
          background: "var(--dark-card)",
          height: "calc(100vh - 220px)",
          minHeight: "400px",
        }}
      >
        {/* Sidebar */}
        <div
          className="w-72 flex-shrink-0 flex flex-col"
          style={{ borderRight: "1px solid rgba(0,245,255,0.1)" }}
        >
          <div className="p-4" style={{ borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
            <h2 className="font-orbitron font-bold text-sm" style={{ color: "var(--neon-cyan)" }}>
              ДИАЛОГИ
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 && (
              <div className="p-6 text-center font-rajdhani text-sm" style={{ color: "rgba(0,245,255,0.3)" }}>
                Нет диалогов
              </div>
            )}
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className="w-full text-left p-4 transition-all"
                style={{
                  background: activeChat === chat.id ? "rgba(0,245,255,0.06)" : "transparent",
                  borderLeft: activeChat === chat.id ? "2px solid var(--neon-cyan)" : "2px solid transparent",
                  borderBottom: "1px solid rgba(0,245,255,0.05)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center font-orbitron font-bold text-sm"
                    style={{
                      background: "rgba(0,245,255,0.1)",
                      border: "1px solid rgba(0,245,255,0.2)",
                      color: "var(--neon-cyan)",
                    }}
                  >
                    {chat.username[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-rajdhani font-semibold text-sm truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                        {chat.username}
                      </span>
                      <span className="font-mono text-xs flex-shrink-0 ml-2" style={{ color: "rgba(0,245,255,0.3)" }}>
                        {chat.time}
                      </span>
                    </div>
                    {chat.product && (
                      <div className="font-mono text-xs truncate mb-0.5" style={{ color: "rgba(0,245,255,0.35)" }}>
                        📦 {chat.product}
                      </div>
                    )}
                    <p className="font-rajdhani text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {chat.lastMessage || "Новый диалог"}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div
                      className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{ background: "var(--neon-cyan)", color: "#000", borderRadius: "50%" }}
                    >
                      {chat.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {activeChatData ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
              <div
                className="w-8 h-8 flex items-center justify-center font-orbitron font-bold text-sm"
                style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}
              >
                {activeChatData.username[0]}
              </div>
              <div>
                <div className="font-rajdhani font-bold text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {activeChatData.username}
                </div>
                {activeChatData.product && (
                  <div className="font-mono text-xs" style={{ color: "rgba(0,245,255,0.4)" }}>
                    📦 {activeChatData.product}
                  </div>
                )}
              </div>
              <div className="ml-auto flex items-center gap-1.5 px-2 py-1 text-xs font-mono"
                style={{ border: "1px solid rgba(0,255,100,0.3)", color: "#00ff88" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                ОНЛАЙН
              </div>
            </div>

            {/* Banner */}
            <div
              className="mx-4 mt-3 p-2.5 text-xs font-rajdhani"
              style={{
                background: "rgba(191,0,255,0.06)",
                border: "1px solid rgba(191,0,255,0.2)",
                color: "rgba(191,0,255,0.7)",
              }}
            >
              💬 Оплата происходит напрямую с продавцом. Уточняйте все условия в чате перед сделкой.
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className="max-w-xs md:max-w-md px-3 py-2"
                    style={{
                      background: msg.isOwn ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${msg.isOwn ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {!msg.isOwn && (
                      <div className="font-mono text-xs mb-1" style={{ color: "rgba(0,245,255,0.5)" }}>
                        {msg.from}
                      </div>
                    )}
                    <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {msg.text}
                    </p>
                    <div className="text-right mt-1 font-mono text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 flex gap-3" style={{ borderTop: "1px solid rgba(0,245,255,0.1)" }}>
              <input
                className="cyber-input flex-1"
                placeholder="Введите сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="cyber-btn cyber-btn-filled px-4 py-2"
                disabled={!input.trim()}
              >
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4" style={{ color: "rgba(0,245,255,0.15)" } as React.CSSProperties} />
              <p className="font-orbitron text-sm" style={{ color: "rgba(0,245,255,0.3)" }}>
                ВЫБЕРИТЕ ДИАЛОГ
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}