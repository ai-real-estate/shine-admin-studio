import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Paperclip, Palette, ChevronDown, ArrowUp, AudioLines } from "lucide-react";

interface PromptChatWindowProps {
  userName?: string;
  onSubmit?: (prompt: string) => void;
}

export const PromptChatWindow = ({ userName = "there", onSubmit }: PromptChatWindowProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim() && onSubmit) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4">
      {/* Greeting */}
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8 text-center">
        Let's build something, {userName}
      </h1>

      {/* Input Card */}
      <div className="w-full rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        {/* Textarea */}
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask to create a dashboard to..."
          className="border-0 bg-transparent resize-none min-h-[100px] focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4 py-4"
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-3 border-t border-border/50">
          {/* Left side buttons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
              <Plus className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
              <Paperclip className="h-4 w-4" />
              <span className="text-sm">Attach</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm">Theme</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Light</DropdownMenuItem>
                <DropdownMenuItem>Dark</DropdownMenuItem>
                <DropdownMenuItem>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <span className="text-sm">Plan</span>
            </Button>

            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
              <AudioLines className="h-5 w-5" />
            </Button>

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
};
