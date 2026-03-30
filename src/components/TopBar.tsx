import { useInfinityStore } from "@/store/agnes-store";
import { Menu } from "lucide-react";

interface TopBarProps {
  title: string;
  children?: React.ReactNode;
}

const TopBar = ({ title, children }: TopBarProps) => {
  const { sidebarOpen, toggleSidebar } = useInfinityStore();

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
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(190,100%,27%)] text-sm font-bold text-primary-foreground">
          V
        </div>
      </div>
    </div>
  );
};

export default TopBar;
