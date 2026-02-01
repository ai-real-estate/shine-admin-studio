import { X, Users, List, Filter, Palette, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionClick: (section: string) => void;
}

const settingsItems = [
  { id: "source-groups", icon: Users, label: "Source groups" },
  { id: "lists", icon: List, label: "Lists" },
  { id: "filter-presets", icon: Filter, label: "Filter presets" },
  { id: "customization", icon: Palette, label: "Customization" },
];

const accountItems = [
  { id: "account-details", icon: User, label: "Account details" },
];

export function SettingsPanel({ isOpen, onClose, activeSection, onSectionClick }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="flex h-screen w-64 flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-base font-semibold text-foreground">Settings</h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Settings Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="flex flex-col gap-1">
          {settingsItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionClick(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-smooth",
                activeSection === item.id
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Account Section */}
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2 px-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Account
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <nav className="flex flex-col gap-1">
            {accountItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionClick(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-smooth",
                  activeSection === item.id
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4">
        <div className="mb-4 flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
          <span className="ml-2 text-xs text-muted-foreground">Light mode</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted">
            Sign in
          </button>
          <button className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-smooth hover:bg-accent/90">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
