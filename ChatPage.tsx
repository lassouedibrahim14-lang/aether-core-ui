import { useState, useRef, useEffect } from "react";
import { useInfinityStore } from "@/store/agnes-store";
import { useTranslation } from "@/hooks/use-translation";
import TopBar from "@/components/TopBar";
import { Send, Loader2 } from "lucide-react";

const ChatPage = () => {
  const { chats, activeChat, sendMessage } = useInfinityStore();
  const { t } = useTranslation();
  const messages = chats[activeChat] || [];
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // 1. إرسال رسالة المستخدم للواجهة
    sendMessage(trimmed);
    setInput("");
    setIsLoading(true);

    try {
      // 2. الاتصال المباشر بـ Vixon-ai في Hugging Face
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Ibrahim14-123/Aether-OS",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: trimmed }),
        }
      );

      const data = await response.json();
      
      // 3. استلام الرد الحقيقي وتمريره للمخزن (Store) ليعرضه فايكسون
      const vixonReply = data[0]?.generated_text || data.generated_text || "أنا أحاول معالجة طلبك..";
      
      // هنا نقوم باستدعاء sendMessage مرة أخرى لإضافة رد البوت
      // ملاحظة: إذا كان الـ Store يضيف "Demo Mode" تلقائياً، ستحتاج لتعديله هناك أيضاً
      sendMessage(vixonReply, "assistant"); 

    } catch (error) {
      console.error("خطأ في الاتصال بالعقل:", error);
    } finally {
      setIsLoading(false);
    }
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

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in px-4">
            <div className="text-5xl mb-4">♾️</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{t("chat.welcome")}</h2>
            <p className="max-w-md text-muted-foreground text-sm">{t("chat.welcomeSub")}</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 sm:px-5 py-3.5 text-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-br from-secondary to-[hsl(222,47%,11%)] border border-primary/10 rounded-br-sm"
                        : "bg-card border border-border rounded-bl-sm"
                    }`}
                  >
                    <span className="mb-1 block text-[0.65rem] font-semibold text-primary">
                      {isUser ? t("chat.you") : t("chat.vixon")}
                    </span>
                    <p className="text-foreground">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-card border border-border rounded-2xl px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border px-4 sm:px-6 py-3 sm:py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2 sm:gap-3 rounded-2xl border border-border bg-card px-3 sm:px-4 py-2 transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_hsl(185_100%_50%/0.15)]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:shadow-[0_0_20px_hsla(185,100%,50%,0.4)] disabled:opacity-30"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;