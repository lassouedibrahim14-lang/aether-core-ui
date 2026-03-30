import { useInfinityStore } from "@/store/agnes-store";
import {
  Plus, Settings, CreditCard, Diamond, HelpCircle, MessageSquare, BookOpen, HardDrive,
} from "lucide-react";

/** Sidebar navigation */
const Sidebar = () => {
  const { chats, activeChat, setActiveChat, createChat, setPage, page } =
    useInfinityStore();

  const navItems = [
    { key: "settings" as const, icon: Settings, label: "Settings" },
    { key: "pricing" as const, icon: CreditCard, label: "Pricing" },
    { key: "memory" as const, icon: HardDrive, label: "Memory" },
    { key: "notebook" as const, icon: BookOpen, label: "Notebook LM" },
    { key: "feedback" as const, icon: MessageSquare, label: "Feedback" },
    { key: "help" as const, icon: HelpCircle, label: "Help" },
  ];

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-extrabold tracking-tight">
          ♾️ <span className="text-primary">Infinity</span>
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">Powered by Vixon AI</p>
      </div>

      {/* New Chat */}
      <div className="px-4 py-3">
        <button
          onClick={createChat}
          className="flex w-full items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_20px_hsla(185,100%,50%,0.25)]"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Gems */}
      <div className="flex-1 overflow-y-auto px-2">
        <p className="mb-2 px-4 pt-4 text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
          Gems
        </p>
        {Object.keys(chats).map((name) => {
          const isActive = name === activeChat && page === "chat";
          return (
            <button
              key={name}
              onClick={() => setActiveChat(name)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-accent-dim text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <Diamond className="h-3.5 w-3.5" />
              {name}
            </button>
          );
        })}
      </div>

      {/* System Nav */}
      <div className="border-t border-border px-2 pb-4 pt-3 space-y-0.5">
        <p className="mb-2 px-4 text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
          System
        </p>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
              page === item.key
                ? "bg-accent-dim text-primary"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" /> {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
