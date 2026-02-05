import { Plus, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  disabled = false,
  className,
  placeholder = "Send a message...",
}: ChatComposerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background overflow-hidden",
        className,
      )}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="border-0 bg-transparent resize-none min-h-[60px] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-3 py-3"
      />
      <div className="flex items-center justify-between px-2 py-2 border-t border-border/30">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="icon-sm"
          className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          onClick={onSubmit}
          disabled={disabled}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

