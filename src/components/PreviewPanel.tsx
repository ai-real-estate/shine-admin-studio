import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  isMobile?: boolean;
}

export function PreviewPanel({ isMobile = false }: PreviewPanelProps) {
  const [typedText, setTypedText] = useState("");
  const fullText = "Building your app...";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        index = 0;
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={cn(
        "flex h-full flex-col items-center justify-center p-8",
        isMobile ? "rounded-lg" : "rounded-2xl border border-border/50"
      )}
      style={{ 
        background: 'radial-gradient(ellipse 60% 80% at 50% 40%, hsl(var(--accent) / 0.1), hsl(var(--background)) 60%, hsl(var(--background)))',
        boxShadow: '0 1px 3px -1px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Animated Demo Content */}
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Typing Text */}
        <div className="text-center">
          <h2 className="text-xl font-medium text-foreground mb-2">
            {typedText}
            <span className="animate-pulse">|</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Your preview will appear here
          </p>
        </div>

        {/* Skeleton App Mockup */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-soft">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          
          {/* Content skeletons */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Floating dots animation */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
