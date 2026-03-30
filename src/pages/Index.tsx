import Sidebar from "@/components/Sidebar";
import ChatPage from "@/pages/ChatPage";
import SettingsPage from "@/pages/SettingsPage";
import PricingPage from "@/pages/PricingPage";
import { useAgnesStore } from "@/store/agnes-store";

const pageMap = {
  chat: ChatPage,
  settings: SettingsPage,
  pricing: PricingPage,
} as const;

const Index = () => {
  const page = useAgnesStore((s) => s.page);
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
