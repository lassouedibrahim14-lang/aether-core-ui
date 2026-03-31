import { useState, useEffect } from "react";
import { useInfinityStore, ULTRA_FREE_EMAILS } from "@/store/agnes-store";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";

interface Tier {
  name: string;
  subtitle?: string;
  price: number;
  discPrice: number;
  features: string[];
  featured: boolean;
}

const tiers: Tier[] = [
  {
    name: "Vixon Pro",
    subtitle: "The Master Tier",
    price: 1500,
    discPrice: 750,
    features: [
      "Vixon-Medium-30B model",
      "128k context window",
      "Advanced coding assistant",
      "Priority Local API access",
      "Unlimited requests",
    ],
    featured: true,
  },
  {
    name: "Vixon Ultra",
    subtitle: "The God Mode Tier",
    price: 5000,
    discPrice: 2500,
    features: [
      "Vixon-Large-8x22B model",
      "AI Photo Generation (Vixon-Image-2.0)",
      "AI Music Generation (Vixon-Audio-1.5)",
      "Video generation (Vixon-Video-3.1)",
      "1 TB integrated storage",
      "24/7 priority developer support",
      "Unlimited everything",
    ],
    featured: false,
  },
];

const PricingPage = () => {
  const { promoApplied, applyPromo } = useInfinityStore();
  const { t } = useTranslation();
  const [promoInput, setPromoInput] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  /** Payment modal state */
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const isUltraUser = userEmail ? ULTRA_FREE_EMAILS.includes(userEmail) : false;

  /** Whether lassouedibrahim14 — payment always verified */
  const isVerifiedPayment = userEmail === "lassouedibrahim14@gmail.com";

  const handlePromo = (val: string) => {
    setPromoInput(val);
    applyPromo(val);
  };

  /** Handle clicking "Get Started" on a tier */
  const handleTierClick = (tier: Tier) => {
    const isFreeForUser = isUltraUser && tier.name === "Vixon Ultra";
    if (isFreeForUser || isVerifiedPayment) return; // already activated
    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title={t("pricing.title")} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-5xl">
          {/* Ultra banner */}
          {isUltraUser && (
            <div className="mb-6 rounded-2xl border border-primary bg-primary/10 p-5 text-center animate-fade-in">
              <p className="text-lg font-bold text-primary">{t("pricing.ultraFree")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("pricing.ultraSub")}</p>
            </div>
          )}

          {/* Verified payment banner for lassouedibrahim14 */}
          {isVerifiedPayment && (
            <div className="mb-6 rounded-2xl border border-primary bg-primary/10 p-4 text-center animate-fade-in">
              <p className="text-sm font-bold text-primary">✅ {t("pricing.paymentVerified")}</p>
            </div>
          )}

          {/* Promo */}
          <div className="mx-auto mb-8 max-w-sm">
            <input
              value={promoInput}
              onChange={(e) => handlePromo(e.target.value)}
              placeholder={t("pricing.promoPlaceholder")}
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_hsl(185_100%_50%/0.15)] placeholder:text-muted-foreground"
            />
          </div>

          {/* Tier cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => {
              const displayPrice = promoApplied ? tier.discPrice : tier.price;
              const isFreeForUser = isUltraUser && tier.name === "Vixon Ultra";
              return (
                <div
                  key={tier.name}
                  className={`relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 animate-fade-in ${
                    tier.featured || isFreeForUser
                      ? "border-primary shadow-[0_0_20px_hsla(185,100%,50%,0.35),0_0_60px_hsla(185,100%,50%,0.10)]"
                      : "border-border hover:border-primary hover:shadow-[0_0_20px_hsla(185,100%,50%,0.25)]"
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-0.5 text-[0.65rem] font-bold text-primary-foreground">POPULAR</span>
                  )}
                  {promoApplied && (
                    <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-0.5 text-[0.65rem] font-bold text-destructive-foreground">-50%</span>
                  )}
                  {isFreeForUser && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-0.5 text-[0.65rem] font-bold text-primary-foreground">FREE ⚡</span>
                  )}

                  <h4 className="text-xl font-bold">{tier.name}</h4>
                  {tier.subtitle && <p className="mt-1 text-xs font-medium text-primary">{tier.subtitle}</p>}

                  {promoApplied && <p className="mt-4 text-lg text-muted-foreground line-through">{tier.price} DZD</p>}
                  <p className="mt-1 text-3xl sm:text-4xl font-extrabold text-primary">
                    {isFreeForUser ? "FREE" : `${displayPrice} DZD`}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("pricing.perMonth")}</p>

                  <ul className="my-6 space-y-0 text-left">
                    {tier.features.map((f) => (
                      <li key={f} className="border-b border-border py-2.5 text-sm text-muted-foreground">
                        <span className="mr-2 text-primary">
                          {isFreeForUser ? "✅" : "✦"}
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleTierClick(tier)}
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-[hsl(190,100%,27%)] py-3 text-sm font-bold text-primary-foreground shadow-[0_0_20px_hsla(185,100%,50%,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_hsla(185,100%,50%,0.5)]"
                  >
                    {isFreeForUser ? t("pricing.activated") : isVerifiedPayment ? `✅ ${t("pricing.activated")}` : t("pricing.getStarted")}
                  </button>
                </div>
              );
            })}
          </div>

          {promoApplied && (
            <p className="mt-6 text-center text-sm font-semibold text-primary animate-fade-in">
              {t("pricing.promoApplied")}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowPaymentModal(false)}>
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 sm:p-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-center mb-1">{t("pricing.choosePayment")}</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {selectedTier.name} — {promoApplied ? selectedTier.discPrice : selectedTier.price} DZD/{t("pricing.perMonth")}
            </p>

            <div className="space-y-3">
              {/* PayPal */}
              <button
                onClick={() => { setShowPaymentModal(false); alert("Redirecting to PayPal…"); }}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:shadow-[0_0_15px_hsla(185,100%,50%,0.2)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.22A.773.773 0 015.707 1.6h6.271c2.087 0 3.754.682 4.578 1.88.763 1.107.926 2.552.459 4.06-.015.048-.032.097-.048.145a7.015 7.015 0 01-.156.442l-.002.005c-.902 2.45-3.048 3.842-6.02 3.842H8.653a.773.773 0 00-.763.623l-.814 5.74z" fill="#003087"/>
                  <path d="M20.302 7.5c-.96 4.16-4.008 5.59-7.972 5.59H10.79l-1.013 6.42h-2.53l.295-1.89.052-.33.814-5.74a.773.773 0 01.763-.623h2.137c2.972 0 5.118-1.393 6.02-3.842l.002-.005c.056-.145.108-.292.156-.442.016-.048.033-.097.048-.145.285-.92.358-1.728.22-2.413.224.161.424.347.598.56.763 1.107.926 2.552.459 4.06l-.509.8z" fill="#0070E0"/>
                </svg>
                PayPal
              </button>

              {/* Baridi Mob */}
              <button
                onClick={() => { setShowPaymentModal(false); alert("Redirecting to Baridi Mob…"); }}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:shadow-[0_0_15px_hsla(185,100%,50%,0.2)]"
              >
                <span className="text-lg">🏦</span>
                Baridi Mob
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-5 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("pricing.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
