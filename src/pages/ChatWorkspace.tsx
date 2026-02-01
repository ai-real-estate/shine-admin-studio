import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MiniSidebar } from "@/components/MiniSidebar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const ChatWorkspace = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  
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
    if (item === "settings") {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
    }
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

      {/* Main Content - Two Panel Layout */}
      <main className="flex flex-1 p-3 gap-3">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Chat Panel - Left Side */}
          <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
            <ChatPanel initialPrompt={initialPrompt} />
          </ResizablePanel>

          <ResizableHandle withHandle className="mx-1" />

          {/* Preview Panel - Right Side */}
          <ResizablePanel defaultSize={60} minSize={40} maxSize={70}>
            <PreviewPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default ChatWorkspace;
