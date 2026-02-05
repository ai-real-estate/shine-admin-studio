 import { useNavigate } from "react-router-dom";
 import { useIsMobile } from "@/hooks/use-mobile";
import { PromptChatWindow } from "@/components/PromptChatWindow";
import { createChatFromPrompt } from "@/lib/chatHistory";

const Index = () => {
  const navigate = useNavigate();
   const isMobile = useIsMobile();

  const handlePromptSubmit = (prompt: string) => {
    const chatId = createChatFromPrompt(prompt);
    navigate(`/chat?chatId=${encodeURIComponent(chatId)}`);
  };

  return (
    <div
       className={`flex flex-1 items-center justify-center ${isMobile ? "" : "rounded-2xl border border-border/50"}`}
      style={{
        background: "radial-gradient(ellipse 60% 80% at 50% 40%, #fffdf7, #fafaf8 60%, #fff)",
         boxShadow: isMobile ? "none" : "0 1px 3px -1px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.04)",
      }}
    >
      <PromptChatWindow userName="User" onSubmit={handlePromptSubmit} />
    </div>
  );
};

export default Index;
