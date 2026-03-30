import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import TopBar from "@/components/TopBar";
import { Send, Star } from "lucide-react";

const FeedbackPage = () => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setFeedback("");
      setRating(0);
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title={t("feedback.title")} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-lg space-y-6">
          {submitted ? (
            <div className="rounded-2xl border border-primary bg-primary/10 p-10 text-center animate-fade-in">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-primary mb-2">{t("feedback.thanks")}</h3>
              <p className="text-sm text-muted-foreground">{t("feedback.thanksSub")}</p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 animate-fade-in">
                <h3 className="mb-4 text-lg font-bold">{t("feedback.rate")}</h3>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`transition-all ${
                        star <= rating ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/60"
                      }`}
                    >
                      <Star className="h-8 w-8" fill={star <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>

                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("feedback.label")}</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  placeholder={t("feedback.placeholder")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_hsl(185_100%_50%/0.15)] placeholder:text-muted-foreground resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!feedback.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[hsl(190,100%,27%)] py-3 text-sm font-bold text-primary-foreground shadow-[0_0_20px_hsla(185,100%,50%,0.35)] transition-all hover:-translate-y-0.5 disabled:opacity-40"
              >
                <Send className="h-4 w-4" /> {t("feedback.submit")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
