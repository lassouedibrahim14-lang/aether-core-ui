import { useState } from "react";
import { useInfinityStore, ULTRA_FREE_EMAILS } from "@/store/agnes-store";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import {
  Sun, Moon, Globe, Link2, Plus, Trash2, LogOut, User,
} from "lucide-react";

const LANGUAGES = [
  { code: "en" as const, label: "English" },
  { code: "ar" as const, label: "العربية" },
  { code: "fr" as const, label: "Français" },
  { code: "es" as const, label: "Español" },
];

const SettingsPage = () => {
  const {
    apiUrl, setApiUrl, model, setModel, temperature, setTemperature,
    theme, setTheme, language, setLanguage,
    savedLinks, addLink, removeLink,
  } = useInfinityStore();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  // Get current user
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  });

  const isUltraUser = userEmail ? ULTRA_FREE_EMAILS.includes(userEmail) : false;
  const models = ["DeepSeek-coder-7B", "Agnes-Large-1B"];

  const handleAddLink = () => {
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      addLink(newLinkTitle.trim(), newLinkUrl.trim());
      setNewLinkTitle("");
      setNewLinkUrl("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const sectionClass = "rounded-2xl border border-border bg-card p-7 animate-fade-in";
  const labelClass = "mb-1.5 block text-xs font-medium text-muted-foreground";
  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_hsl(185_100%_50%/0.15)]";

  return (
    <div className="flex h-full flex-col">
      <TopBar title="⚙  Infinity Settings" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Account */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Account
            </h3>
            {userEmail ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Signed in as <span className="font-semibold text-foreground">{userEmail}</span>
                </p>
                {isUltraUser && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                    ⚡ Ultra Plan — Free Forever
                  </div>
                )}
                <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-destructive hover:underline">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not signed in.</p>
            )}
          </section>

          {/* Appearance */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              Appearance
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Moon className="mx-auto mb-2 h-5 w-5" /> Dark
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Sun className="mx-auto mb-2 h-5 w-5" /> Light
              </button>
            </div>
          </section>

          {/* Language */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Language
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    language === lang.code
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </section>

          {/* API Configuration */}
          <section className={sectionClass}>
            <h3 className="mb-5 text-lg font-bold">🔗 API Configuration</h3>
            <label className={labelClass}>Local Unsloth API URL</label>
            <input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className={`${inputClass} mb-5`} />

            <label className={labelClass}>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className={`${inputClass} mb-5`}>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <label className={labelClass}>Temperature: {temperature.toFixed(2)}</label>
            <input
              type="range" min={0} max={2} step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
          </section>

          {/* Saved Links */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" /> Saved Links
            </h3>
            <div className="space-y-2 mb-4">
              {savedLinks.length === 0 && (
                <p className="text-sm text-muted-foreground">No links saved yet.</p>
              )}
              {savedLinks.map((link, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                    {link.title}
                  </a>
                  <button onClick={() => removeLink(i)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input placeholder="Title" value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} className={`${inputClass} flex-1`} />
              <input placeholder="URL" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} className={`${inputClass} flex-1`} />
              <button onClick={handleAddLink} className="flex items-center justify-center rounded-xl bg-primary px-3 text-primary-foreground hover:shadow-[0_0_15px_hsla(185,100%,50%,0.3)]">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
