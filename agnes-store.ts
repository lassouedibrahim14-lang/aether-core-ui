import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Represents a single chat message */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Global application state for Vixon */
interface InfinityState {
  page: "chat" | "settings" | "pricing" | "help" | "feedback" | "notebook" | "memory" | "ai-images";
  setPage: (page: InfinityState["page"]) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  language: "en" | "ar" | "fr" | "es";
  setLanguage: (lang: InfinityState["language"]) => void;
  chats: Record<string, ChatMessage[]>;
  activeChat: string;
  setActiveChat: (name: string) => void;
  createChat: () => void;
  sendMessage: (content: string) => Promise<void>; // تحولت إلى Promise لأنها تنتظر الرد
  promoApplied: boolean;
  applyPromo: (code: string) => void;
  savedLinks: { title: string; url: string }[];
  addLink: (title: string, url: string) => void;
  removeLink: (index: number) => void;
}

export const ULTRA_FREE_EMAILS = [
  "lassouedibrahim14@gmail.com",
  "hammabosch@gmail.com",
];

export const useInfinityStore = create<InfinityState>()(
  persist(
    (set, get) => ({
      page: "chat",
      setPage: (page) => set({ page }),
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      theme: "dark",
      setTheme: (theme) => {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        }
        set({ theme });
      },
      language: "en",
      setLanguage: (language) => set({ language }),
      chats: { General: [] },
      activeChat: "General",
      setActiveChat: (name) => set({ activeChat: name, page: "chat" }),
      createChat: () => {
        const { chats } = get();
        const name = `Chat ${Object.keys(chats).length + 1}`;
        set({ chats: { ...chats, [name]: [] }, activeChat: name, page: "chat" });
      },

      // --- تعديل دالة الإرسال لتعمل مع العقل الحقيقي ---
      sendMessage: async (content) => {
        const { chats, activeChat } = get();
        const currentMessages = [...(chats[activeChat] || [])];
        
        // 1. إضافة رسالة المستخدم فوراً
        const updatedMessagesWithUser = [...currentMessages, { role: "user", content } as ChatMessage];
        set({ chats: { ...chats, [activeChat]: updatedMessagesWithUser } });

        try {
          // 2. الاتصال بـ Hugging Face (عقل Aether-OS)
          const response = await fetch(
            "https://api-inference.huggingface.co/models/Ibrahim14-123/Aether-OS",
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ inputs: content }),
            }
          );

          const data = await response.json();
          
          // تنظيف الرد (لأن Hugging Face أحياناً يرجع قائمة أو كائن)
          let vixonReply = "";
          if (Array.isArray(data)) {
            vixonReply = data[0]?.generated_text || "لم أستطع معالجة النص.";
          } else {
            vixonReply = data.generated_text || "خطأ في استلام الرد.";
          }

          // 3. إضافة رد فايكسون الحقيقي للمحادثة
          set((state) => ({
            chats: {
              ...state.chats,
              [activeChat]: [...(state.chats[activeChat] || []), { role: "assistant", content: vixonReply }]
            }
          }));

        } catch (error) {
          console.error("Vixon Error:", error);
          set((state) => ({
            chats: {
              ...state.chats,
              [activeChat]: [...(state.chats[activeChat] || []), { role: "assistant", content: "عذراً يا إبراهيم، واجهت مشكلة في الاتصال بعقلي السحابي." }]
            }
          }));
        }
      },

      promoApplied: false,
      applyPromo: (code) => set({ promoApplied: code.trim().toUpperCase() === "VITCHI14" }),
      savedLinks: [],
      addLink: (title, url) => set((s) => ({ savedLinks: [...s.savedLinks, { title, url }] })),
      removeLink: (index) => set((s) => ({ savedLinks: s.savedLinks.filter((_, i) => i !== index) })),
    }),
    {
      name: "infinity-store",
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        savedLinks: state.savedLinks,
      }),
    }
  )
);