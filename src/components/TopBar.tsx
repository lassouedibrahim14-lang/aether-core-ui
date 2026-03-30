interface TopBarProps {
  title: string;
}

/** Top bar with page title and profile avatar */
const TopBar = ({ title }: TopBarProps) => (
  <div className="flex items-center justify-between border-b border-border px-6 py-3">
    <h2 className="text-base font-semibold">{title}</h2>
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(190,100%,27%)] text-sm font-bold text-primary-foreground">
      A
    </div>
  </div>
);

export default TopBar;
