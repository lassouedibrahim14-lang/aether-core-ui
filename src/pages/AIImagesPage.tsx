import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import TopBar from "@/components/TopBar";
import { ImagePlus, Sparkles, Download } from "lucide-react";

/**
 * AI Image Generation page — allows users to generate images from text prompts.
 * Currently runs in demo mode with placeholder previews.
 */
const AIImagesPage = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<
    { prompt: string; url: string }[]
  >([]);

  /** Simulate image generation (demo mode) */
  const handleGenerate = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setGenerating(true);

    /* Simulate a 2s generation delay */
    setTimeout(() => {
      const placeholderUrl = `https://placehold.co/512x512/0d1117/00e5cc?text=${encodeURIComponent(
        trimmed.slice(0, 20)
      )}`;
      setGeneratedImages((prev) => [
        { prompt: trimmed, url: placeholderUrl },
        ...prev,
      ]);
      setPrompt("");
      setGenerating(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title={t("aiImages.title")} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl">
          {/* Prompt input */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold">{t("aiImages.createTitle")}</h3>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-border bg-background px-3 sm:px-4 py-2 transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_hsl(185_100%_50%/0.15)]">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("aiImages.placeholder")}
                disabled={generating}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:shadow-[0_0_20px_hsla(185,100%,50%,0.4)] disabled:opacity-30"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
            </div>
            {generating && (
              <p className="mt-3 text-xs text-primary animate-pulse">
                {t("aiImages.generating")}
              </p>
            )}
          </div>

          {/* Generated images grid */}
          {generatedImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <ImagePlus className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">
                {t("aiImages.empty")}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {generatedImages.map((img, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card animate-fade-in"
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-xs text-white/80 truncate">{img.prompt}</p>
                  </div>
                  <a
                    href={img.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImagesPage;
