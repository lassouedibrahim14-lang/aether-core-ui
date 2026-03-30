import { useAgnesStore } from "@/store/agnes-store";
import TopBar from "@/components/TopBar";

/** Settings page — API config and appearance */
const SettingsPage = () => {
  const { apiUrl, setApiUrl, model, setModel, temperature, setTemperature } = useAgnesStore();

  const models = ["DeepSeek-coder-7B", "Agnes-Large-1B"];

  return (
    <div className="flex h-full flex-col">
      <TopBar title="⚙  Aether Settings" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* API Configuration */}
          <section className="rounded-2xl border border-border bg-card p-7 animate-fade-in">
            <h3 className="mb-5 text-lg font-bold">🔗 API Configuration</h3>

            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Local Unsloth API URL
            </label>
            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="mb-5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_hsl(185_100%_50%/0.15)]"
            />

            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mb-5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary"
            >
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Temperature: {temperature.toFixed(2)}
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
          </section>

          {/* Appearance */}
          <section className="rounded-2xl border border-border bg-card p-7 animate-fade-in">
            <h3 className="mb-3 text-lg font-bold">🎨 Appearance</h3>
            <p className="text-sm text-muted-foreground">
              Theme: <span className="font-semibold text-foreground">Aether Dark</span> (default)
            </p>
            <p className="text-sm text-muted-foreground">Font: Plus Jakarta Sans</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
