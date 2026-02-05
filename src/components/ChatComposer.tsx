import { useCallback, useEffect, useMemo, useRef } from "react";
import { Plus, ArrowUp, Clock, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type ChatComposerVariant = "desktop" | "mobile";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  disabled?: boolean;
  variant: ChatComposerVariant;
}

const MOBILE_TEXTAREA_MAX_HEIGHT_PX = 120;

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  variant,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const showDot = useMemo(() => value.trim().length > 0, [value]);

  const resizeMobileTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, MOBILE_TEXTAREA_MAX_HEIGHT_PX);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > MOBILE_TEXTAREA_MAX_HEIGHT_PX ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    if (variant !== "mobile") return;
    resizeMobileTextarea();
  }, [resizeMobileTextarea, value, variant]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  if (variant === "mobile") {
    return (
      <div className="border-t border-border bg-background py-2 pb-4">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-card overflow-hidden px-3 py-2">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 border-0 bg-transparent resize-none min-h-[44px] max-h-[120px] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-0 py-0 placeholder:text-muted-foreground"
          />
          {showDot && <span className="h-2 w-2 rounded-full bg-primary mb-2" />}
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <Clock className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1 h-8 text-xs"
            >
              <span>Sonnet 4.5</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              size="icon-sm"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8"
              onClick={onSubmit}
              disabled={disabled}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Claude is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-0 bg-transparent resize-none min-h-[60px] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-3 py-3"
        />
        <div className="flex items-center justify-between px-2 py-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
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
    </div>
  );
}

