import { X, FileText, Sparkles } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import { listChats, onChatHistoryUpdated, type ChatSession } from "@/lib/chatHistory";
import { useCallback, useEffect, useMemo, useState } from "react";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (chatId: string) => void;
}

function formatUpdatedAt(updatedAt: number) {
  try {
    return formatDistanceToNowStrict(updatedAt, { addSuffix: true });
  } catch {
    return "";
  }
}

export function HistoryPanel({ isOpen, onClose, onOpenChat }: HistoryPanelProps) {
  const [chats, setChats] = useState<ChatSession[]>([]);

  const refresh = useCallback(() => {
    setChats(listChats());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    refresh();
    return onChatHistoryUpdated(refresh);
  }, [isOpen, refresh]);

  const hasChats = chats.length > 0;

  const emptyState = useMemo(() => {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileText className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div className="text-sm font-medium text-foreground">No history yet</div>
        <div className="mt-1 text-xs text-muted-foreground">Start a chat to see it here.</div>
      </div>
    );
  }, []);

  if (!isOpen) return null;

  return (
    <div className="flex h-screen w-80 flex-col animate-slide-in-right border-l border-border/50 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-base font-semibold text-foreground">History</h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
          type="button"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* List */}
      {hasChats ? (
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="flex flex-col gap-1">
            {chats.map((chat) => {
              const docsCount = chat.documents?.length ?? 0;
              const artifactsCount = chat.artifacts?.length ?? 0;

              return (
                <button
                  key={chat.id}
                  onClick={() => onOpenChat(chat.id)}
                  className={cn(
                    "w-full rounded-xl border border-transparent px-3 py-3 text-left transition-smooth",
                    "hover:bg-muted/60 hover:text-foreground"
                  )}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-foreground">{chat.title || "New chat"}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {chat.updatedAt ? formatUpdatedAt(chat.updatedAt) : ""}
                      </div>
                    </div>
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      Docs {docsCount}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      Artifacts {artifactsCount}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        emptyState
      )}
    </div>
  );
}
