import { useState, useRef, useEffect } from "react";
import { useAgnesStore } from "@/store/agnes-store";
import TopBar from "@/components/TopBar";
import { Send } from "lucide-react";

/** Main chat page with message list and input */
const ChatPage = () => {
  const { chats, activeChat, sendMessage } = useAgnesStore();
  const messages = chats[activeChat] || [];
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title={`💎 ${activeChat}`} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in">
            <div className="text-5xl mb-4">🔮</div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Agnes AI</h2>
            <p className="max-w-md text-muted-foreground">
              Start a conversation with the most advanced AI assistant. Type your message below to begin.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-br from-secondary to-[hsl(222,47%,11%)] border border-primary/10 rounded-br-sm"
                        : "bg-card border border-border rounded-bl-sm"
                    }`}
                  >
                    <span className="mb-1 block text-[0.65rem] font-semibold text-primary">
                      {isUser ? "You" : "Agnes"}
                    </span>
                    <p className="text-foreground">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2 transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_hsl(185_100%_50%/0.15)]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Agnes…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:shadow-[0_0_20px_hsla(185,100%,50%,0.4)] disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
