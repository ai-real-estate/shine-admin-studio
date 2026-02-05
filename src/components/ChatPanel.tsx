import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useHaptic } from "@/hooks/use-haptic";
import { appendMessage, getChat, type ChatMessage as StoredChatMessage } from "@/lib/chatHistory";
import { ChatComposer } from "@/components/ChatComposer";

interface ChatPanelProps {
  chatId: string;
  onMessage?: (message: string) => void;
  mobileMode?: boolean;
}

function safeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ChatPanel({ chatId, onMessage, mobileMode = false }: ChatPanelProps) {
  const [messages, setMessages] = useState<StoredChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const haptic = useHaptic();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getChat(chatId);
    setMessages(session?.messages ?? []);
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    haptic.medium();

    const now = Date.now();
    const newMessage: StoredChatMessage = {
      id: safeId(),
      role: "user",
      content: prompt,
      createdAt: now,
    };

    setMessages((prev) => [...prev, newMessage]);
    appendMessage(chatId, "user", prompt);
    onMessage?.(prompt);
    setPrompt("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: StoredChatMessage = {
        id: safeId(),
        role: "assistant",
        content: "I'm processing your request...",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      appendMessage(chatId, "assistant", assistantMessage.content);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Mobile mode: composer only (reuse same UI as desktop)
  if (mobileMode) {
    return (
      <div className="border-t border-border bg-background p-3 pb-4">
        <ChatComposer
          value={prompt}
          onChange={setPrompt}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          disabled={!prompt.trim()}
        />
      </div>
    );
  }

  // Desktop mode: full chat panel
  return (
    <div className="flex h-full flex-col bg-card rounded-2xl border border-border/50">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2.5 text-sm",
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3">
        <ChatComposer
          value={prompt}
          onChange={setPrompt}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          disabled={!prompt.trim()}
        />
      </div>
    </div>
  );
}
