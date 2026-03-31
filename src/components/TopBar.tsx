import { useState, useEffect } from "react";
import { useInfinityStore } from "@/store/agnes-store";
import { supabase } from "@/integrations/supabase/client";
import { Menu } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TopBarProps {
  title: string;
  children?: React.ReactNode;
}

const TopBar = ({ title, children }: TopBarProps) => {
  const { sidebarOpen, toggleSidebar } = useInfinityStore();
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  /** Fetch user metadata (name + avatar from Google OAuth or email) */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      const meta = user.user_metadata;
      setUserName(meta?.full_name ?? meta?.name ?? user.email?.split("@")[0] ?? null);
      setUserAvatar(meta?.avatar_url ?? meta?.picture ?? null);
    });
  }, []);

  /** Get initials for avatar fallback */
  const initials = userName
    ? userName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "V";

  return (
    <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-3">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h2 className="text-sm sm:text-base font-semibold truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {/* User avatar + name */}
        <div className="flex items-center gap-2">
          {userName && (
            <span className="hidden sm:inline text-xs font-medium text-muted-foreground truncate max-w-[120px]">
              {userName}
            </span>
          )}
          <Avatar className="h-9 w-9">
            {userAvatar ? (
              <AvatarImage src={userAvatar} alt={userName ?? "User"} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-primary to-[hsl(190,100%,27%)] text-xs font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
