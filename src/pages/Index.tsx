import { useNavigate } from "react-router-dom";
import { PromptChatWindow } from "@/components/PromptChatWindow";

const Index = () => {
  const navigate = useNavigate();

  const handlePromptSubmit = (prompt: string) => {
    navigate(`/chat?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div
      className="flex flex-1 items-center justify-center rounded-2xl border border-border/50"
      style={{
        background: "radial-gradient(ellipse 60% 80% at 50% 40%, #fffdf7, #fafaf8 60%, #fff)",
        boxShadow: "0 1px 3px -1px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.04)",
      }}
    >
      <PromptChatWindow userName="User" onSubmit={handlePromptSubmit} />
    </div>
  );
};

export default Index;
