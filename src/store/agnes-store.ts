import { create } from "zustand";

/** Represents a single chat message */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Global application state for Agnes AI */
interface AgnesState {
  /* Navigation */
  page: "chat" | "settings" | "pricing";
  setPage: (page: AgnesState["page"]) => void;

  /* Chat management */
  chats: Record<string, ChatMessage[]>;
  activeChat: string;
  setActiveChat: (name: string) => void;
  createChat: () => void;
  sendMessage: (content: string) => void;

  /* Settings */
  apiUrl: string;
  setApiUrl: (url: string) => void;
  model: string;
  setModel: (model: string) => void;
  temperature: number;
  setTemperature: (temp: number) => void;

  /* Promo */
  promoApplied: boolean;
  applyPromo: (code: string) => void;
}

export const useAgnesStore = create<AgnesState>((set, get) => ({
  page: "chat",
  setPage: (page) => set({ page }),

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
    const { chats, activeChat, model } = get();
    const messages = [...(chats[activeChat] || [])];
    messages.push({ role: "user", content });
    // Simulated AI response
    messages.push({
      role: "assistant",
      content: `Thank you for your message. As Agnes AI (model: ${model}), I'm currently running in demo mode. Your prompt was: "${content}"`,
    });
    set({ chats: { ...chats, [activeChat]: messages } });
  },

  apiUrl: "http://localhost:8000/v1",
  setApiUrl: (apiUrl) => set({ apiUrl }),
  model: "DeepSeek-coder-7B",
  setModel: (model) => set({ model }),
  temperature: 0.7,
  setTemperature: (temperature) => set({ temperature }),

  promoApplied: false,
  applyPromo: (code) => set({ promoApplied: code.trim().toUpperCase() === "VITCHI14" }),
}));
