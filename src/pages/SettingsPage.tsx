import { useState, useEffect } from "react";
import { useInfinityStore, ULTRA_FREE_EMAILS } from "@/store/agnes-store";
import { useTranslation } from "@/hooks/use-translation";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
    theme, setTheme, language, setLanguage,
    savedLinks, addLink, removeLink,
  } = useInfinityStore();
  const { t } = useTranslation();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      setUserEmail(user.email ?? null);
      const meta = user.user_metadata;
      setUserName(meta?.full_name ?? meta?.name ?? user.email?.split("@")[0] ?? null);
      setUserAvatar(meta?.avatar_url ?? meta?.picture ?? null);
    });
  }, []);

  const isUltraUser = userEmail ? ULTRA_FREE_EMAILS.includes(userEmail) : false;

  const initials = userName
    ? userName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "V";

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

  const sectionClass = "rounded-2xl border border-border bg-card p-5 sm:p-7 animate-fade-in";
  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_hsl(185_100%_50%/0.15)]";

  return (
    <div className="flex h-full flex-col">
      <TopBar title={t("settings.title")} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Account — shows avatar, name, email */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> {t("settings.account")}
            </h3>
            {userEmail ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    {userAvatar ? <AvatarImage src={userAvatar} alt={userName ?? "User"} /> : null}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-[hsl(190,100%,27%)] text-lg font-bold text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-semibold text-foreground">{userName}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                {isUltraUser && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                    {t("settings.ultraPlan")}
                  </div>
                )}
                <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-destructive hover:underline">
                  <LogOut className="h-3.5 w-3.5" /> {t("settings.signOut")}
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("settings.notSignedIn")}</p>
            )}
          </section>

          {/* Appearance */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              {t("settings.appearance")}
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
                <Moon className="mx-auto mb-2 h-5 w-5" /> {t("settings.dark")}
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Sun className="mx-auto mb-2 h-5 w-5" /> {t("settings.light")}
              </button>
            </div>
          </section>

          {/* Language */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> {t("settings.language")}
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

          {/* Saved Links */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" /> {t("settings.savedLinks")}
            </h3>
            <div className="space-y-2 mb-4">
              {savedLinks.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("settings.noLinks")}</p>
              )}
              {savedLinks.map((link, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                    {link.title}
                  </a>
                  <button onClick={() => removeLink(i)} className="text-destructive hover:text-destructive/80 shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input placeholder={t("settings.linkTitle")} value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} className={`${inputClass} flex-1`} />
              <input placeholder={t("settings.linkUrl")} value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} className={`${inputClass} flex-1`} />
              <button onClick={handleAddLink} className="flex items-center justify-center rounded-xl bg-primary px-3 py-2.5 sm:py-0 text-primary-foreground hover:shadow-[0_0_15px_hsla(185,100%,50%,0.3)]">
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
