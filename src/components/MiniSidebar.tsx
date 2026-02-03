import { Zap, FileText, Globe, GitBranch, Code, Bell, Settings, User, Share2, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface MiniSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  unreadCount?: number;
}

const navItems = [
  { id: "web", icon: Globe, label: "Web" },
  { id: "documents", icon: FileText, label: "Documents" },
  // { id: "sources", icon: GitBranch, label: "Sources" },
  // { id: "code", icon: Code, label: "Code" },
  { id: "api", icon: Zap, label: "API" },
  { id: "platforms", icon: Share2, label: "Platforms" },
  { id: "my-listings", icon: LayoutList, label: "My Listings" },
];

const bottomItems = [
  { id: "notifications", icon: Bell, label: "Notifications", hasBadge: true },
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "account", icon: User, label: "Account" },
];

export function MiniSidebar({ activeItem, onItemClick, unreadCount = 0 }: MiniSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-16 flex-col items-center bg-background py-4">
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-accent hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className="text-lg font-bold text-accent-foreground">P</span>
      </button>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map((item) => (
          <Tooltip key={item.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-smooth",
                  activeItem === item.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="rounded-lg">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map((item) => (
          <Tooltip key={item.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-lg transition-smooth",
                  activeItem === item.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
                {item.hasBadge && unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="rounded-lg">
              {item.label}
              {item.hasBadge && unreadCount > 0 && ` (${unreadCount} unread)`}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
