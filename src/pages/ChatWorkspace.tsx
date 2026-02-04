import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { PropertyListing } from "@/components/PropertyListing";
import { PropertyValuation } from "@/components/PropertyValuation";
import { UndervaluedProperties } from "@/components/UndervaluedProperties";
import { GenerateListing } from "@/components/GenerateListing";
import { RentAnalytics } from "@/components/RentAnalytics";
import { RentAnalyticsV2 } from "@/components/RentAnalyticsV2";
import { AgentGrid } from "@/components/AgentGrid";
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
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const lowerPrompt = initialPrompt.toLowerCase();
  
  const [showPropertyListing, setShowPropertyListing] = useState(
    PROPERTY_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
  const [showValuation, setShowValuation] = useState(
    VALUATION_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
  const [showUndervalued, setShowUndervalued] = useState(
    UNDERVALUED_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
  const [showGenerateListing, setShowGenerateListing] = useState(
    GENERATE_LISTING_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
  const [showRentAnalytics, setShowRentAnalytics] = useState(
    RENT_ANALYTICS_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
  const [showRentAnalyticsV2, setShowRentAnalyticsV2] = useState(
    RENT_ANALYTICS_V2_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );
  const [showAgentGrid, setShowAgentGrid] = useState(
    AGENT_KEYWORDS.some(kw => lowerPrompt.includes(kw))
  );

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

  const renderRightPanel = () => {
    if (showAgentGrid) {
      return (
        <div className="h-full rounded-2xl border border-border/50 overflow-hidden">
          <AgentGrid />
        </div>
      );
    }
    if (showRentAnalyticsV2) {
      return (
        <div className="h-full rounded-2xl border border-border/50 overflow-hidden">
          <RentAnalyticsV2 />
        </div>
      );
    }
    if (showRentAnalytics) {
      return (
        <div className="h-full rounded-2xl border border-border/50 overflow-hidden">
          <RentAnalytics />
        </div>
      );
    }
    if (showGenerateListing) {
      return (
        <div className="h-full rounded-2xl border border-border/50 overflow-hidden">
          <GenerateListing />
        </div>
      );
    }
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
    <div className="flex flex-1 gap-3">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
          <ChatPanel initialPrompt={initialPrompt} onMessage={handleChatMessage} />
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
