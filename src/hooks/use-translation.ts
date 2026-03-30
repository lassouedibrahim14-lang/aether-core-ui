import { useInfinityStore } from "@/store/agnes-store";
import { translations, type Language } from "@/i18n/translations";

/** Hook to get a translation function based on the current language */
export function useTranslation() {
  const language = useInfinityStore((s) => s.language);

  const t = (key: string): string => {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  };

  /** Check if current language is RTL */
  const isRTL = language === "ar";

  return { t, language, isRTL };
}
