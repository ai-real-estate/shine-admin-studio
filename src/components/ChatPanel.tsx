import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Paperclip, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { appendMessage, getChat, type ChatMessage as StoredChatMessage } from "@/lib/chatHistory";

interface ChatPanelProps {
  chatId: string;
  onMessage?: (message: string) => void;
}

function safeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ChatPanel({ chatId, onMessage }: ChatPanelProps) {
  const [messages, setMessages] = useState<StoredChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
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
        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="border-0 bg-transparent resize-none min-h-[60px] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-3 py-3"
          />
          <div className="flex items-center justify-between px-2 py-2 border-t border-border/30">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              size="icon-sm" 
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              onClick={handleSubmit}
              disabled={!prompt.trim()}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
