import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInfinityStore } from "@/store/agnes-store";
import Sidebar from "@/components/Sidebar";
import ChatPage from "@/pages/ChatPage";
import SettingsPage from "@/pages/SettingsPage";
import PricingPage from "@/pages/PricingPage";
import FeedbackPage from "@/pages/FeedbackPage";
import HelpPage from "@/pages/HelpPage";
import NotebookPage from "@/pages/NotebookPage";
import MemoryPage from "@/pages/MemoryPage";
import AuthPage from "@/pages/AuthPage";
import type { Session } from "@supabase/supabase-js";

const pageMap = {
  chat: ChatPage,
  settings: SettingsPage,
  pricing: PricingPage,
  feedback: FeedbackPage,
  help: HelpPage,
  notebook: NotebookPage,
  memory: MemoryPage,
} as const;

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { page, theme } = useInfinityStore();

  useEffect(() => {
    // Apply theme on mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [theme]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-2xl font-bold">♾️ Loading...</div>
      </div>
    );
  }

  if (!session) return <AuthPage />;

  const PageComponent = pageMap[page];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <PageComponent />
      </main>
    </div>
  );
};

export default Index;
