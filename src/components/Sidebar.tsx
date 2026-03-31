import { useInfinityStore } from "@/store/agnes-store";
import { useTranslation } from "@/hooks/use-translation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Plus, Settings, CreditCard, Diamond, HelpCircle, MessageSquare, BookOpen, HardDrive, X, ImagePlus,
} from "lucide-react";

const Sidebar = () => {
  const { chats, activeChat, setActiveChat, createChat, setPage, page, sidebarOpen, setSidebarOpen } =
    useInfinityStore();
  const { t, isRTL } = useTranslation();
  const isMobile = useIsMobile();

  const navItems = [
    { key: "settings" as const, icon: Settings, label: t("sidebar.settings") },
    { key: "pricing" as const, icon: CreditCard, label: t("sidebar.pricing") },
    { key: "memory" as const, icon: HardDrive, label: t("sidebar.memory") },
    { key: "notebook" as const, icon: BookOpen, label: t("sidebar.notebook") },
    { key: "feedback" as const, icon: MessageSquare, label: t("sidebar.feedback") },
    { key: "help" as const, icon: HelpCircle, label: t("sidebar.help") },
  ];

  const handleNav = (key: typeof page) => {
    setPage(key);
    if (isMobile) setSidebarOpen(false);
  };

  const handleChatClick = (name: string) => {
    setActiveChat(name);
    if (isMobile) setSidebarOpen(false);
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`flex h-screen w-72 flex-col border-border bg-card z-50 ${
          isMobile
            ? `fixed top-0 ${isRTL ? "right-0 border-l" : "left-0 border-r"} animate-fade-in`
            : `relative ${isRTL ? "border-l" : "border-r"}`
        }`}
      >
        {/* Header — Vixon branding */}
        <div className="flex items-center justify-between px-5 pt-6 pb-2">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              ♾️ <span className="text-primary">Vixon</span>
            </h1>
            <p className="mt-0.5 text-[0.6rem] font-light text-muted-foreground tracking-wide">
              {t("sidebar.developedBy")}
            </p>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* New Chat */}
        <div className="px-4 py-3">
          <button
            onClick={() => { createChat(); if (isMobile) setSidebarOpen(false); }}
            className="flex w-full items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_20px_hsla(185,100%,50%,0.25)]"
          >
            <Plus className="h-4 w-4" />
            {t("sidebar.newChat")}
          </button>
        </div>

        {/* Gems */}
        <div className="flex-1 overflow-y-auto px-2">
          <p className="mb-2 px-4 pt-4 text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
            {t("sidebar.gems")}
          </p>
          {Object.keys(chats).map((name) => {
            const isActive = name === activeChat && page === "chat";
            return (
              <button
                key={name}
                onClick={() => handleChatClick(name)}
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
            {t("sidebar.system")}
          </p>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
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
    </>
  );
};

export default Sidebar;
