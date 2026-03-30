import TopBar from "@/components/TopBar";
import { Shield, HelpCircle, BookOpen, ExternalLink } from "lucide-react";

const helpSections = [
  {
    icon: HelpCircle,
    title: "Getting Started",
    description: "Learn how to use Infinity and Vixon AI to boost your productivity.",
    items: [
      "Create a new chat from the sidebar",
      "Type your prompt and press Enter or click Send",
      "Switch between chats using the Gems panel",
      "Configure your AI model in Settings",
    ],
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your data is important to us. Here's how we protect it.",
    items: [
      "All conversations are encrypted in transit",
      "We do not sell or share your personal data",
      "You can delete your data at any time",
      "Local API mode keeps data on your machine",
    ],
  },
  {
    icon: BookOpen,
    title: "FAQ",
    description: "Answers to frequently asked questions.",
    items: [
      "Q: Is Vixon AI free? — Yes, the Free tier is always available.",
      "Q: Can I switch models? — Yes, go to Settings → API Configuration.",
      "Q: How do I upgrade? — Visit the Pricing page.",
      "Q: Where can I report bugs? — Use the Feedback page.",
    ],
  },
];

const HelpPage = () => (
  <div className="flex h-full flex-col">
    <TopBar title="❓  Help Center" />

    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {helpSections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-border bg-card p-7 animate-fade-in">
            <h3 className="mb-2 text-lg font-bold flex items-center gap-2">
              <section.icon className="h-5 w-5 text-primary" />
              {section.title}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{section.description}</p>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-primary">✦</span>
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
          <ExternalLink className="h-4 w-4" /> Privacy Policy
        </a>
      </div>
    </div>
  </div>
);

export default HelpPage;
