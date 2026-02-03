import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MiniSidebar } from "@/components/MiniSidebar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PromptChatWindow } from "@/components/PromptChatWindow";

const Index = () => {
  const [activeItem, setActiveItem] = useState("api");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("source-groups");
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    if (item === "notifications") {
      navigate("/notifications");
      return;
    }
    if (item === "platforms") {
      navigate("/platforms");
      return;
    }
    if (item === "my-listings") {
      navigate("/my-listings");
      return;
    }
    if (item === "settings") {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
    }
  };

  const handlePromptSubmit = (prompt: string) => {
    navigate(`/chat?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Mini Sidebar */}
      <MiniSidebar activeItem={activeItem} onItemClick={handleItemClick} unreadCount={2} />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setActiveItem("api");
        }}
        activeSection={activeSection}
        onSectionClick={setActiveSection}
      />

      {/* Main Content */}
      <main className="flex flex-1 p-3 pl-0" style="padding-left:0">
        <div 
          className="flex flex-1 items-center justify-center rounded-2xl border border-border/50"
          style={{ 
            background: 'radial-gradient(ellipse 60% 80% at 50% 40%, #fffdf7, #fafaf8 60%, #fff)',
            boxShadow: '0 1px 3px -1px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.04)'
          }}
        >
          <PromptChatWindow userName="User" onSubmit={handlePromptSubmit} />
        </div>
      </main>
    </div>
  );
};

export default Index;
