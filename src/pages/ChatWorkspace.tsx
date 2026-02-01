import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MiniSidebar } from "@/components/MiniSidebar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { PropertyListing } from "@/components/PropertyListing";
import { PropertyValuation } from "@/components/PropertyValuation";
import { UndervaluedProperties } from "@/components/UndervaluedProperties";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const PROPERTY_KEYWORDS = ["find property", "find properties"];
const VALUATION_KEYWORDS = ["valuation", "valuate", "estimation", "estimate"];
const UNDERVALUED_KEYWORDS = ["undervalued"];

const ChatWorkspace = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const lowerPrompt = initialPrompt.toLowerCase();
  
  const [activeItem, setActiveItem] = useState("api");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("source-groups");
  const [showPropertyListing, setShowPropertyListing] = useState(
    PROPERTY_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
  const [showValuation, setShowValuation] = useState(
    VALUATION_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
  const [showUndervalued, setShowUndervalued] = useState(
    UNDERVALUED_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
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

  const handleChatMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (PROPERTY_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      setShowPropertyListing(true);
      setShowValuation(false);
      setShowUndervalued(false);
    } else if (VALUATION_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      setShowValuation(true);
      setShowPropertyListing(false);
      setShowUndervalued(false);
    } else if (UNDERVALUED_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      setShowUndervalued(true);
      setShowPropertyListing(false);
      setShowValuation(false);
    }
  };

  const renderRightPanel = () => {
    if (showUndervalued) {
      return (
        <div className="h-full rounded-2xl border border-border/50 overflow-hidden">
          <UndervaluedProperties />
        </div>
      );
    }
    if (showValuation) {
      return (
        <div className="h-full rounded-2xl border border-border/50 overflow-hidden">
          <PropertyValuation />
        </div>
      );
    }
    if (showPropertyListing) {
      return (
        <div className="h-full rounded-2xl border border-border/50 overflow-hidden">
          <PropertyListing />
        </div>
      );
    }
    return <PreviewPanel />;
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
            <ChatPanel initialPrompt={initialPrompt} onMessage={handleChatMessage} />
          </ResizablePanel>

          <ResizableHandle withHandle className="mx-1" />

          {/* Preview Panel - Right Side */}
          <ResizablePanel defaultSize={60} minSize={40} maxSize={70}>
            {renderRightPanel()}
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default ChatWorkspace;
