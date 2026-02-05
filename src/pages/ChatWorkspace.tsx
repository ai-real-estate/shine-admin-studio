import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { PropertyListing } from "@/components/PropertyListing";
import { PropertyValuation } from "@/components/PropertyValuation";
import { UndervaluedProperties } from "@/components/UndervaluedProperties";
import { GenerateListing } from "@/components/GenerateListing";
import { RentAnalytics } from "@/components/RentAnalytics";
import { RentAnalyticsV2 } from "@/components/RentAnalyticsV2";
import { AgentGrid } from "@/components/AgentGrid";
import { addArtifact, addDocument, createChatFromPrompt, createEmptyChat, getChat } from "@/lib/chatHistory";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const PROPERTY_KEYWORDS = ["find property", "find properties"];
const VALUATION_KEYWORDS = ["valuation", "valuate", "estimation", "estimate"];
const UNDERVALUED_KEYWORDS = ["undervalued"];
const GENERATE_LISTING_KEYWORDS = ["generate listing", "create listing", "new listing"];
const RENT_ANALYTICS_KEYWORDS = ["avg rent", "rent miami", "average rent"];
const RENT_ANALYTICS_V2_KEYWORDS = ["rental analytics"];
const AGENT_KEYWORDS = ["find agent", "find agents", "real estate agent"];

const ChatWorkspace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const promptParam = searchParams.get("prompt") || "";
  const chatIdParam = searchParams.get("chatId") || "";

  const [chatId, setChatId] = useState<string>("");

  const [showPropertyListing, setShowPropertyListing] = useState(false);
  const [showValuation, setShowValuation] = useState(false);
  const [showUndervalued, setShowUndervalued] = useState(false);
  const [showGenerateListing, setShowGenerateListing] = useState(false);
  const [showRentAnalytics, setShowRentAnalytics] = useState(false);
  const [showRentAnalyticsV2, setShowRentAnalyticsV2] = useState(false);
  const [showAgentGrid, setShowAgentGrid] = useState(false);

  useEffect(() => {
    if (chatIdParam) {
      const existing = getChat(chatIdParam);
      if (existing) {
        setChatId(chatIdParam);
        return;
      }
    }

    const nextChatId = promptParam.trim() ? createChatFromPrompt(promptParam) : createEmptyChat();
    setSearchParams({ chatId: nextChatId }, { replace: true });
    setChatId(nextChatId);
  }, [chatIdParam, promptParam, setSearchParams]);

  const seedText = useMemo(() => {
    if (!chatId) return "";
    const session = getChat(chatId);
    const firstUserMessage = session?.messages?.find((m) => m.role === "user")?.content ?? "";
    return firstUserMessage || session?.title || "";
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    const lowerSeed = seedText.toLowerCase();
    setShowPropertyListing(PROPERTY_KEYWORDS.some((kw) => lowerSeed.includes(kw)));
    setShowValuation(VALUATION_KEYWORDS.some((kw) => lowerSeed.includes(kw)));
    setShowUndervalued(UNDERVALUED_KEYWORDS.some((kw) => lowerSeed.includes(kw)));
    setShowGenerateListing(GENERATE_LISTING_KEYWORDS.some((kw) => lowerSeed.includes(kw)));
    setShowRentAnalytics(RENT_ANALYTICS_KEYWORDS.some((kw) => lowerSeed.includes(kw)));
    setShowRentAnalyticsV2(RENT_ANALYTICS_V2_KEYWORDS.some((kw) => lowerSeed.includes(kw)));
    setShowAgentGrid(AGENT_KEYWORDS.some((kw) => lowerSeed.includes(kw)));
  }, [chatId, seedText]);

  const handleChatMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Reset all panels first
    const resetPanels = () => {
      setShowRentAnalyticsV2(false);
      setShowRentAnalytics(false);
      setShowGenerateListing(false);
      setShowPropertyListing(false);
      setShowValuation(false);
      setShowUndervalued(false);
      setShowAgentGrid(false);
    };
    
    if (AGENT_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      resetPanels();
      setShowAgentGrid(true);
    } else if (RENT_ANALYTICS_V2_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      resetPanels();
      setShowRentAnalyticsV2(true);
    } else if (RENT_ANALYTICS_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      resetPanels();
      setShowRentAnalytics(true);
    } else if (GENERATE_LISTING_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      resetPanels();
      setShowGenerateListing(true);
    } else if (PROPERTY_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      resetPanels();
      setShowPropertyListing(true);
    } else if (VALUATION_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      resetPanels();
      setShowValuation(true);
    } else if (UNDERVALUED_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
      resetPanels();
      setShowUndervalued(true);
    }
  };

  useEffect(() => {
    if (!chatId) return;
    if (showAgentGrid) addArtifact(chatId, "Agent Grid");
  }, [chatId, showAgentGrid]);

  useEffect(() => {
    if (!chatId) return;
    if (showRentAnalyticsV2) addArtifact(chatId, "Rent Analytics");
  }, [chatId, showRentAnalyticsV2]);

  useEffect(() => {
    if (!chatId) return;
    if (showRentAnalytics) addArtifact(chatId, "Avg Rent");
  }, [chatId, showRentAnalytics]);

  useEffect(() => {
    if (!chatId) return;
    if (showGenerateListing) addArtifact(chatId, "Generate Listing");
  }, [chatId, showGenerateListing]);

  useEffect(() => {
    if (!chatId) return;
    if (showUndervalued) addArtifact(chatId, "Undervalued Properties");
  }, [chatId, showUndervalued]);

  useEffect(() => {
    if (!chatId) return;
    if (showValuation) addArtifact(chatId, "Property Valuation");
  }, [chatId, showValuation]);

  useEffect(() => {
    if (!chatId) return;
    if (showPropertyListing) addArtifact(chatId, "Property Listing");
  }, [chatId, showPropertyListing]);

  const renderRightPanel = () => {
    if (showAgentGrid) {
      return (
        <div className={`h-full overflow-hidden ${isMobile ? "rounded-lg" : "rounded-2xl border border-border/50"}`}>
          <AgentGrid />
        </div>
      );
    }
    if (showRentAnalyticsV2) {
      return (
        <div className={`h-full overflow-hidden ${isMobile ? "rounded-lg" : "rounded-2xl border border-border/50"}`}>
          <RentAnalyticsV2 />
        </div>
      );
    }
    if (showRentAnalytics) {
      return (
        <div className={`h-full overflow-hidden ${isMobile ? "rounded-lg" : "rounded-2xl border border-border/50"}`}>
          <RentAnalytics />
        </div>
      );
    }
    if (showGenerateListing) {
      return (
        <div className={`h-full overflow-hidden ${isMobile ? "rounded-lg" : "rounded-2xl border border-border/50"}`}>
          <GenerateListing
            onSaveDraft={(title) => {
              if (!chatId) return;
              addDocument(chatId, title);
            }}
          />
        </div>
      );
    }
    if (showUndervalued) {
      return (
        <div className={`h-full overflow-hidden ${isMobile ? "rounded-lg" : "rounded-2xl border border-border/50"}`}>
          <UndervaluedProperties />
        </div>
      );
    }
    if (showValuation) {
      return (
        <div className={`h-full overflow-hidden ${isMobile ? "rounded-lg" : "rounded-2xl border border-border/50"}`}>
          <PropertyValuation />
        </div>
      );
    }
    if (showPropertyListing) {
      return (
        <div className={`h-full overflow-hidden ${isMobile ? "rounded-lg" : "rounded-2xl border border-border/50"}`}>
          <PropertyListing />
        </div>
      );
    }
    return <PreviewPanel isMobile={isMobile} />;
  };

  // Mobile layout: full screen content with bottom input
  if (isMobile) {
    return (
      <div className="flex flex-1 flex-col h-full relative">
        {/* Content area - scrollable */}
        <div className="flex-1 overflow-auto pt-12">
          {renderRightPanel()}
        </div>
        
        {/* Bottom input area */}
        {chatId && (
          <ChatPanel 
            chatId={chatId} 
            onMessage={handleChatMessage} 
            mobileMode 
          />
        )}
      </div>
    );
  }

  // Desktop layout: resizable panels
  return (
    <div className="flex flex-1 gap-3">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
          {chatId ? (
            <ChatPanel chatId={chatId} onMessage={handleChatMessage} />
          ) : (
            <div className="h-full rounded-2xl border border-border/50 bg-card" />
          )}
        </ResizablePanel>

        <ResizableHandle withHandle className="mx-1" />

        <ResizablePanel defaultSize={60} minSize={40} maxSize={70}>
          {renderRightPanel()}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ChatWorkspace;
