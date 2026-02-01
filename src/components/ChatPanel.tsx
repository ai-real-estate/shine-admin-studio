import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Paperclip, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  initialPrompt?: string;
  onMessage?: (message: string) => void;
}

export function ChatPanel({ initialPrompt, onMessage }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initial: ChatMessage[] = [];
    if (initialPrompt) {
      initial.push({
        id: '1',
        role: 'user',
        content: initialPrompt,
        timestamp: new Date(),
      });
      initial.push({
        id: '2',
        role: 'assistant',
        content: "I'm working on that for you...",
        timestamp: new Date(),
      });
    }
    return initial;
  });
  const [prompt, setPrompt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    onMessage?.(prompt);
    setPrompt("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm processing your request...",
        timestamp: new Date(),
      }]);
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
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  message.role === 'user'
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
