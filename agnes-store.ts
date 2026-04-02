import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

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
  isTyping: boolean;
  setActiveChat: (name: string) => void;
  createChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  lastGeneratedImageUrl: string | null;
  generatingImage: boolean;
  generateImage: (prompt: string) => Promise<string | null>;
  promoApplied: boolean;
  applyPromo: (code: string) => void;
  savedLinks: { title: string; url: string }[];
  addLink: (title: string, url: string) => void;
  removeLink: (index: number) => void;
}

const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_ACCESS_TOKEN;

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
        const root = document.documentElement;
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        set({ theme });
      },
      language: "en",
      setLanguage: (language) => set({ language }),
      chats: { General: [] },
      activeChat: "General",
      isTyping: false,
      setActiveChat: (name) => set({ activeChat: name, page: "chat" }),
      createChat: () => {
        const { chats } = get();
        const name = `Chat ${Object.keys(chats).length + 1}`;
        set({ chats: { ...chats, [name]: [] }, activeChat: name, page: "chat" });
      },
      sendMessage: async (content) => {
        const { chats, activeChat } = get();
        set((state) => ({
          chats: { ...state.chats, [activeChat]: [...(state.chats[activeChat] || []), { role: "user", content }] },
          isTyping: true,
        }));
        try {
          const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
              headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ inputs: `[INST] You are Vixon, the AI of Aether OS. Answer in the same language as the user: ${content} [/INST]` }),
            }
          );
          const data = await response.json();
          const reply = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
          const cleanReply = reply?.split('[/INST]')?.pop()?.trim() || "System Error";
          
          set((state) => ({
            chats: { ...state.chats, [activeChat]: [...(state.chats[activeChat] || []), { role: "assistant", content: cleanReply }] },
            isTyping: false,
          }));
        } catch (error) {
          set((state) => ({
            chats: { ...state.chats, [activeChat]: [...(state.chats[activeChat] || []), { role: "assistant", content: "Connection Error", isError: true }] },
            isTyping: false,
          }));
        }
      },
      lastGeneratedImageUrl: null,
      generatingImage: false,
      generateImage: async (prompt) => {
        set({ generatingImage: true, lastGeneratedImageUrl: null });
        try {
          const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
              headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ inputs: prompt }),
            }
          );
          if (!response.ok) throw new Error("Image Generation Failed");
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          set({ lastGeneratedImageUrl: imageUrl, generatingImage: false });
          return imageUrl;
        } catch (error) {
          set({ generatingImage: false });
          return null;
        }
      },
      promoApplied: false,
      applyPromo: (code) => set({ promoApplied: code.trim().toUpperCase() === "VITCHI14" }),
      savedLinks: [],
      addLink: (title, url) => set((s) => ({ savedLinks: [...s.savedLinks, { title, url }] })),
      removeLink: (index) => set((s) => ({ savedLinks: s.savedLinks.filter((_, i) => i !== index) })),
    }),
    {
      name: "aether-os-store",
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        savedLinks: state.savedLinks,
      }),
    }
  )
);