import { Bell, Check, Clock, MessageSquare, Users, Zap, Settings2, X } from "lucide-react";
import { MiniSidebar } from "@/components/MiniSidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface Notification {
  id: string;
  type: "message" | "update" | "team" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "New message received",
    description: "You have a new message from the support team regarding your recent inquiry.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "update",
    title: "API update available",
    description: "A new version of the API is available with improved performance.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "team",
    title: "Team member joined",
    description: "Alex Johnson has joined your workspace.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "System maintenance",
    description: "Scheduled maintenance will occur on Sunday at 2:00 AM UTC.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "5",
    type: "message",
    title: "Reply to your feedback",
    description: "The product team has responded to your feature request.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "6",
    type: "update",
    title: "New features released",
    description: "Check out the latest features including dark mode and custom themes.",
    time: "3 days ago",
    read: true,
  },
];

type FilterType = "all" | "message" | "update" | "team" | "system";

const filterTabs: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "message", label: "Messages", icon: MessageSquare },
  { id: "update", label: "Updates", icon: Zap },
  { id: "team", label: "Team", icon: Users },
  { id: "system", label: "System", icon: Bell },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "message":
      return MessageSquare;
    case "update":
      return Zap;
    case "team":
      return Users;
    case "system":
      return Bell;
  }
};

interface NotificationPreferences {
  messages: boolean;
  updates: boolean;
  team: boolean;
  system: boolean;
  email: boolean;
  push: boolean;
}

export default function Notifications() {
  const [activeItem, setActiveItem] = useState("notifications");
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    messages: true,
    updates: true,
    team: true,
    system: true,
    email: false,
    push: true,
  });
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    if (item === "notifications") return;
    if (item === "platforms") {
      navigate("/platforms");
      return;
    }
    if (item === "my-listings") {
      navigate("/my-listings");
      return;
    }
    navigate("/");
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <MiniSidebar activeItem={activeItem} onItemClick={handleItemClick} unreadCount={unreadCount} />

      <main className="flex flex-1 p-3 pl-0">
        <div
          className="flex flex-1 flex-col rounded-2xl border border-border/50"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 40%, #fffdf7, #fafaf8 60%, #fff)",
            boxShadow: "0 1px 3px -1px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-medium text-accent-foreground">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-smooth",
                  showPreferences
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Settings2 className="h-4 w-4" strokeWidth={1.5} />
                Preferences
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
                >
                  <Check className="h-4 w-4" strokeWidth={1.5} />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-border/30 px-6 py-3">
            {filterTabs.map((tab) => {
              const count =
                tab.id === "all"
                  ? notifications.length
                  : notifications.filter((n) => n.type === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-smooth",
                    activeFilter === tab.id
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" strokeWidth={1.5} />
                  {tab.label}
                  <span
                    className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs",
                      activeFilter === tab.id
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Notifications List */}
            <div className={cn("flex-1 overflow-y-auto p-4", showPreferences && "border-r border-border/30")}>
              <div className="flex flex-col gap-2">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" strokeWidth={1} />
                    <p className="text-sm text-muted-foreground">No notifications in this category</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <button
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`flex items-start gap-4 rounded-xl p-4 text-left transition-smooth ${
                          notification.read
                            ? "hover:bg-muted/50"
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            notification.read ? "bg-muted" : "bg-accent"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              notification.read ? "text-muted-foreground" : "text-accent-foreground"
                            }`}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-sm ${
                                notification.read
                                  ? "font-medium text-foreground"
                                  : "font-semibold text-foreground"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-accent" />
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" strokeWidth={1.5} />
                            {notification.time}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Preferences Panel */}
            {showPreferences && (
              <div className="w-80 shrink-0 overflow-y-auto p-4 animate-slide-in-right">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-foreground">Notification Preferences</h2>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Notification Types */}
                <div className="mb-6">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                    Notification Types
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <span className="text-sm text-foreground">Messages</span>
                      </div>
                      <Switch
                        checked={preferences.messages}
                        onCheckedChange={() => togglePreference("messages")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <span className="text-sm text-foreground">Updates</span>
                      </div>
                      <Switch
                        checked={preferences.updates}
                        onCheckedChange={() => togglePreference("updates")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <span className="text-sm text-foreground">Team</span>
                      </div>
                      <Switch
                        checked={preferences.team}
                        onCheckedChange={() => togglePreference("team")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        <span className="text-sm text-foreground">System</span>
                      </div>
                      <Switch
                        checked={preferences.system}
                        onCheckedChange={() => togglePreference("system")}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Methods */}
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                    Delivery Methods
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-foreground">Email notifications</span>
                        <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={preferences.email}
                        onCheckedChange={() => togglePreference("email")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-foreground">Push notifications</span>
                        <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <Switch
                        checked={preferences.push}
                        onCheckedChange={() => togglePreference("push")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
