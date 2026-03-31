import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Represents a single chat message */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Global application state for Vixon */
interface InfinityState {
  /* Navigation */
  page: "chat" | "settings" | "pricing" | "help" | "feedback" | "notebook" | "memory" | "ai-images";
  setPage: (page: InfinityState["page"]) => void;

  /* Sidebar */
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  /* Theme */
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;

  /* Language */
  language: "en" | "ar" | "fr" | "es";
  setLanguage: (lang: InfinityState["language"]) => void;

  /* Chat management */
  chats: Record<string, ChatMessage[]>;
  activeChat: string;
  setActiveChat: (name: string) => void;
  createChat: () => void;
  sendMessage: (content: string) => void;

  /* Promo */
  promoApplied: boolean;
  applyPromo: (code: string) => void;

  /* Links */
  savedLinks: { title: string; url: string }[];
  addLink: (title: string, url: string) => void;
  removeLink: (index: number) => void;
}

/** Emails that get free Ultra access */
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
        set({
          chats: { ...chats, [name]: [] },
          activeChat: name,
          page: "chat",
        });
      },
      sendMessage: (content) => {
        const { chats, activeChat } = get();
        const messages = [...(chats[activeChat] || [])];
        messages.push({ role: "user", content });
        messages.push({
          role: "assistant",
          content: `Thank you for your message. As Vixon, I'm currently running in demo mode. Your prompt was: "${content}"`,
        });
        set({ chats: { ...chats, [activeChat]: messages } });
      },

      promoApplied: false,
      applyPromo: (code) =>
        set({ promoApplied: code.trim().toUpperCase() === "VITCHI14" }),

      savedLinks: [],
      addLink: (title, url) =>
        set((s) => ({ savedLinks: [...s.savedLinks, { title, url }] })),
      removeLink: (index) =>
        set((s) => ({
          savedLinks: s.savedLinks.filter((_, i) => i !== index),
        })),
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
