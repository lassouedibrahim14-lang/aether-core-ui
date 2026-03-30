import { useState } from "react";
import { useAgnesStore } from "@/store/agnes-store";
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
    name: "Agnes Free",
    price: 100,
    discPrice: 50,
    features: ["Agnes-Tiny-7B model", "Basic context window", "50 AI requests / day", "Community support"],
    featured: false,
  },
  {
    name: "Agnes Pro",
    subtitle: "The Master Tier",
    price: 1500,
    discPrice: 750,
    features: [
      "Agnes-Medium-30B model",
      "128k context window",
      "Advanced coding assistant",
      "Priority Local API access",
      "Unlimited requests",
    ],
    featured: true,
  },
  {
    name: "Agnes Ultra",
    subtitle: "The God Mode Tier",
    price: 5000,
    discPrice: 2500,
    features: [
      "Agnes-Large-8x22B model",
      "Video generation (Agnes-Video-3.1)",
      "1 TB integrated storage",
      "24/7 priority developer support",
      "Unlimited everything",
    ],
    featured: false,
  },
];

/** Pricing page with promo code and 3-tier cards */
const PricingPage = () => {
  const { promoApplied, applyPromo } = useAgnesStore();
  const [promoInput, setPromoInput] = useState("");

  const handlePromo = (val: string) => {
    setPromoInput(val);
    applyPromo(val);
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="💳  Agnes AI Pricing" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-5xl">
          {/* Promo input */}
          <div className="mx-auto mb-8 max-w-sm">
            <input
              value={promoInput}
              onChange={(e) => handlePromo(e.target.value)}
              placeholder="🎟  Enter Promo Code"
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_hsl(185_100%_50%/0.15)] placeholder:text-muted-foreground"
            />
          </div>

          {/* Tier cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => {
              const displayPrice = promoApplied ? tier.discPrice : tier.price;
              return (
                <div
                  key={tier.name}
                  className={`relative overflow-hidden rounded-2xl border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-1 animate-fade-in ${
                    tier.featured
                      ? "border-primary shadow-[0_0_20px_hsla(185,100%,50%,0.35),0_0_60px_hsla(185,100%,50%,0.10)]"
                      : "border-border hover:border-primary hover:shadow-[0_0_20px_hsla(185,100%,50%,0.25)]"
                  }`}
                >
                  {/* Badges */}
                  {tier.featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-0.5 text-[0.65rem] font-bold text-primary-foreground">
                      POPULAR
                    </span>
                  )}
                  {promoApplied && (
                    <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-0.5 text-[0.65rem] font-bold text-destructive-foreground">
                      -50%
                    </span>
                  )}

                  <h4 className="text-xl font-bold">{tier.name}</h4>
                  {tier.subtitle && (
                    <p className="mt-1 text-xs font-medium text-primary">{tier.subtitle}</p>
                  )}

                  {promoApplied && (
                    <p className="mt-4 text-lg text-muted-foreground line-through">{tier.price} DZD</p>
                  )}
                  <p className="mt-1 text-4xl font-extrabold text-primary">{displayPrice} DZD</p>
                  <p className="text-xs text-muted-foreground">per month</p>

                  <ul className="my-6 space-y-0 text-left">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="border-b border-border py-2.5 text-sm text-muted-foreground"
                      >
                        <span className="mr-2 text-primary">✦</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full rounded-xl bg-gradient-to-r from-primary to-[hsl(190,100%,27%)] py-3 text-sm font-bold text-primary-foreground shadow-[0_0_20px_hsla(185,100%,50%,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_hsla(185,100%,50%,0.5)]">
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>

          {promoApplied && (
            <p className="mt-6 text-center text-sm font-semibold text-primary animate-fade-in">
              🎉 Promo code VITCHI14 applied — 50% off!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
