interface TopBarProps {
  title: string;
  children?: React.ReactNode;
}

const TopBar = ({ title, children }: TopBarProps) => (
  <div className="flex items-center justify-between border-b border-border px-6 py-3">
    <h2 className="text-base font-semibold">{title}</h2>
    <div className="flex items-center gap-3">
      {children}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(190,100%,27%)] text-sm font-bold text-primary-foreground">
        V
      </div>
    </div>
  </div>
);

export default TopBar;
