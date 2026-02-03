import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MiniSidebar } from "@/components/MiniSidebar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Share2,
  Search,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Unlink,
  Building2,
  Home,
  MapPin,
  Globe2,
  Landmark,
  Store,
  Building,
  Castle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
  region: string;
}

const initialPlatforms: Platform[] = [
  {
    id: "mls",
    name: "MLS",
    description: "Multiple Listing Service - the industry standard",
    icon: <Building2 className="h-5 w-5" />,
    connected: true,
    lastSync: "2 min ago",
    region: "North America",
  },
  {
    id: "zillow",
    name: "Zillow",
    description: "America's most visited real estate website",
    icon: <Home className="h-5 w-5" />,
    connected: true,
    lastSync: "5 min ago",
    region: "North America",
  },
  {
    id: "realtor",
    name: "Realtor.com",
    description: "List properties on America's #1 site",
    icon: <Landmark className="h-5 w-5" />,
    connected: false,
    region: "North America",
  },
  {
    id: "redfin",
    name: "Redfin",
    description: "Reach tech-savvy home buyers",
    icon: <MapPin className="h-5 w-5" />,
    connected: false,
    region: "North America",
  },
  {
    id: "bayut",
    name: "Bayut",
    description: "UAE's leading property portal",
    icon: <Castle className="h-5 w-5" />,
    connected: false,
    region: "Middle East",
  },
  {
    id: "propertyfinder",
    name: "PropertyFinder",
    description: "Middle East's property marketplace",
    icon: <Store className="h-5 w-5" />,
    connected: false,
    region: "Middle East",
  },
  {
    id: "idealista",
    name: "Idealista",
    description: "Spain & Portugal's real estate leader",
    icon: <Globe2 className="h-5 w-5" />,
    connected: false,
    region: "Europe",
  },
  {
    id: "lun",
    name: "Lun",
    description: "Ukraine's property platform",
    icon: <Building className="h-5 w-5" />,
    connected: false,
    region: "Europe",
  },
];

const ConnectPlatforms = () => {
  const [activeItem, setActiveItem] = useState("platforms");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("source-groups");
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    if (item === "notifications") {
      navigate("/notifications");
      return;
    }
    if (item === "platforms") {
      return;
    }
    if (item === "settings") {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
      navigate("/");
    }
  };

  const filteredPlatforms = platforms.filter((platform) => {
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === "all" || platform.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const connectedPlatforms = filteredPlatforms.filter((p) => p.connected);
  const availablePlatforms = filteredPlatforms.filter((p) => !p.connected);

  const handleConnect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setConnectDialogOpen(true);
    setApiKey("");
  };

  const handleConfirmConnect = () => {
    if (!selectedPlatform) return;

    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === selectedPlatform.id
          ? { ...p, connected: true, lastSync: "Just now" }
          : p
      )
    );
    setConnectDialogOpen(false);
    toast({
      title: "Platform connected",
      description: `${selectedPlatform.name} has been connected successfully.`,
    });
  };

  const handleDisconnect = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platform.id
          ? { ...p, connected: false, lastSync: undefined }
          : p
      )
    );
    toast({
      title: "Platform disconnected",
      description: `${platform.name} has been disconnected.`,
    });
  };

  const handleSync = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platform.id ? { ...p, lastSync: "Just now" } : p
      )
    );
    toast({
      title: "Sync started",
      description: `Syncing with ${platform.name}...`,
    });
  };

  const regions = ["all", "North America", "Europe", "Middle East"];

  return (
    <div className="flex h-screen w-full bg-background">
      <MiniSidebar activeItem={activeItem} onItemClick={handleItemClick} unreadCount={2} />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setActiveItem("platforms");
        }}
        activeSection={activeSection}
        onSectionClick={setActiveSection}
      />

      <main className="flex flex-1 p-3">
        <div
          className="flex flex-1 flex-col rounded-2xl border border-border/50 overflow-hidden"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 40%, #fffdf7, #fafaf8 60%, #fff)",
            boxShadow: "0 1px 3px -1px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-lg font-semibold">Connect Platforms</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search platforms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full pl-9 sm:w-48"
                />
              </div>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="h-9 w-full sm:w-40">
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region === "all" ? "All regions" : region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="mx-auto max-w-2xl p-4 space-y-6">
              {/* Connected Platforms */}
              {connectedPlatforms.length > 0 && (
                <section>
                  <h2 className="text-sm font-medium text-muted-foreground mb-3">
                    Connected ({connectedPlatforms.length})
                  </h2>
                  <div className="space-y-2">
                    {connectedPlatforms.map((platform) => (
                      <Card key={platform.id} className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              {platform.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{platform.name}</span>
                                <Badge variant="secondary" className="shrink-0 text-xs">
                                  Connected
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Last synced: {platform.lastSync}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSync(platform)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Sync Now
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDisconnect(platform)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Unlink className="mr-2 h-4 w-4" />
                                Disconnect
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Available Platforms */}
              {availablePlatforms.length > 0 && (
                <section>
                  <h2 className="text-sm font-medium text-muted-foreground mb-3">
                    Available ({availablePlatforms.length})
                  </h2>
                  <div className="space-y-2">
                    {availablePlatforms.map((platform) => (
                      <Card key={platform.id} className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                              {platform.icon}
                            </div>
                            <div className="min-w-0">
                              <span className="font-medium truncate block">{platform.name}</span>
                              <p className="text-xs text-muted-foreground truncate">
                                {platform.description}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConnect(platform)}
                            className="shrink-0"
                          >
                            Connect
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {filteredPlatforms.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Share2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No platforms found</p>
                  <p className="text-sm text-muted-foreground/70">
                    Try adjusting your search or filter
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>

      {/* Connect Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPlatform?.icon}
              Connect to {selectedPlatform?.name}
            </DialogTitle>
            <DialogDescription>
              Connect your {selectedPlatform?.name} account to sync your listings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button className="w-full" variant="outline">
              Sign in with {selectedPlatform?.name}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or use API key
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                You can find your API key in your {selectedPlatform?.name} account settings.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmConnect}>Connect</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectPlatforms;
