import { useTranslation } from "@/hooks/use-translation";
import TopBar from "@/components/TopBar";
import { Shield, HelpCircle, BookOpen, ExternalLink } from "lucide-react";

const HelpPage = () => {
  const { t } = useTranslation();

  const helpSections = [
    {
      icon: HelpCircle,
      title: t("help.gettingStarted"),
      description: t("help.gettingStartedDesc"),
      items: [t("help.gs1"), t("help.gs2"), t("help.gs3"), t("help.gs4")],
    },
    {
      icon: Shield,
      title: t("help.privacy"),
      description: t("help.privacyDesc"),
      items: [t("help.p1"), t("help.p2"), t("help.p3"), t("help.p4")],
    },
    {
      icon: BookOpen,
      title: t("help.faq"),
      description: t("help.faqDesc"),
      items: [t("help.f1"), t("help.f2"), t("help.f3"), t("help.f4")],
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <TopBar title={t("help.title")} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {helpSections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-border bg-card p-5 sm:p-7 animate-fade-in">
              <h3 className="mb-2 text-lg font-bold flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">{section.description}</p>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 text-primary shrink-0">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-4 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" /> {t("help.privacyPolicy")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
