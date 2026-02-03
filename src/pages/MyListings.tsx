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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Search,
  Plus,
  LayoutList,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Copy,
  Archive,
  Trash2,
  Eye,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MyListing {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "House" | "Condo" | "Townhouse" | "Apartment" | "Commercial";
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: "draft" | "active" | "sold" | "archived";
  platforms: string[];
  views: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
}

const mockListings: MyListing[] = [
  {
    id: "1",
    title: "Modern 3-Bedroom Home with Pool",
    address: "123 Sunset Boulevard, Los Angeles, CA 90028",
    price: 1250000,
    type: "House",
    beds: 3,
    baths: 2,
    sqft: 2400,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    status: "active",
    platforms: ["MLS", "Zillow", "Realtor.com"],
    views: 245,
    inquiries: 12,
    createdAt: "2026-01-15",
    updatedAt: "2026-01-28",
  },
  {
    id: "2",
    title: "Luxury Penthouse with City Views",
    address: "456 Downtown Ave, Miami, FL 33130",
    price: 2850000,
    type: "Condo",
    beds: 4,
    baths: 3,
    sqft: 3200,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    status: "active",
    platforms: ["MLS", "Zillow"],
    views: 189,
    inquiries: 8,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-25",
  },
  {
    id: "3",
    title: "Cozy Townhouse Near Park",
    address: "789 Oak Street, Seattle, WA 98101",
    price: 650000,
    type: "Townhouse",
    beds: 2,
    baths: 2,
    sqft: 1600,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop",
    status: "draft",
    platforms: [],
    views: 0,
    inquiries: 0,
    createdAt: "2026-01-20",
    updatedAt: "2026-01-20",
  },
  {
    id: "4",
    title: "Charming Victorian Estate",
    address: "321 Heritage Lane, San Francisco, CA 94102",
    price: 3200000,
    type: "House",
    beds: 5,
    baths: 4,
    sqft: 4500,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    status: "sold",
    platforms: ["MLS", "Zillow", "Redfin"],
    views: 892,
    inquiries: 45,
    createdAt: "2025-12-01",
    updatedAt: "2026-01-15",
  },
  {
    id: "5",
    title: "Downtown Studio Apartment",
    address: "555 Main Street, Austin, TX 78701",
    price: 285000,
    type: "Apartment",
    beds: 1,
    baths: 1,
    sqft: 650,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    status: "draft",
    platforms: [],
    views: 0,
    inquiries: 0,
    createdAt: "2026-01-22",
    updatedAt: "2026-01-22",
  },
  {
    id: "6",
    title: "Commercial Office Space",
    address: "100 Business Park, Denver, CO 80202",
    price: 1500000,
    type: "Commercial",
    beds: 0,
    baths: 2,
    sqft: 5000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    status: "active",
    platforms: ["MLS"],
    views: 67,
    inquiries: 3,
    createdAt: "2026-01-05",
    updatedAt: "2026-01-18",
  },
];

type StatusFilter = "all" | "draft" | "active" | "sold" | "archived";
type ViewMode = "grid" | "table";

const statusTabs: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "active", label: "Active" },
  { id: "sold", label: "Sold" },
  { id: "archived", label: "Archived" },
];

const getStatusBadgeVariant = (status: MyListing["status"]) => {
  switch (status) {
    case "active":
      return "default";
    case "sold":
      return "secondary";
    case "draft":
      return "outline";
    case "archived":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusColor = (status: MyListing["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "sold":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "draft":
      return "bg-muted text-muted-foreground";
    case "archived":
      return "bg-muted text-muted-foreground";
    default:
      return "";
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function MyListings() {
  const [activeItem, setActiveItem] = useState("my-listings");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("source-groups");
  const [listings, setListings] = useState(mockListings);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    if (item === "notifications") {
      navigate("/notifications");
      return;
    }
    if (item === "platforms") {
      navigate("/platforms");
      return;
    }
    if (item === "my-listings") {
      return;
    }
    if (item === "settings") {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
      navigate("/");
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status: StatusFilter) => {
    if (status === "all") return listings.length;
    return listings.filter((l) => l.status === status).length;
  };

  const handleEdit = (listing: MyListing) => {
    navigate(`/chat?prompt=edit listing ${listing.id}`);
  };

  const handleDuplicate = (listing: MyListing) => {
    const newListing: MyListing = {
      ...listing,
      id: String(Date.now()),
      title: `${listing.title} (Copy)`,
      status: "draft",
      platforms: [],
      views: 0,
      inquiries: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setListings((prev) => [newListing, ...prev]);
    toast({
      title: "Listing duplicated",
      description: "A copy of the listing has been created as a draft.",
    });
  };

  const handleArchive = (listing: MyListing) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listing.id
          ? { ...l, status: l.status === "archived" ? "draft" : "archived" }
          : l
      )
    );
    toast({
      title: listing.status === "archived" ? "Listing unarchived" : "Listing archived",
      description:
        listing.status === "archived"
          ? "The listing has been moved to drafts."
          : "The listing has been archived.",
    });
  };

  const handleDelete = (listing: MyListing) => {
    setListings((prev) => prev.filter((l) => l.id !== listing.id));
    toast({
      title: "Listing deleted",
      description: "The listing has been permanently removed.",
    });
  };

  const handleNewListing = () => {
    navigate("/chat?prompt=generate listing");
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <MiniSidebar activeItem={activeItem} onItemClick={handleItemClick} unreadCount={2} />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setActiveItem("my-listings");
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
          <div className="flex flex-col gap-3 border-b border-border/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <LayoutList className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-lg font-semibold">My Listings</h1>
              </div>
              <Button onClick={handleNewListing}>
                <Plus className="h-4 w-4" />
                New Listing
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1">
                {statusTabs.map((tab) => {
                  const count = getStatusCount(tab.id);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-smooth",
                        statusFilter === tab.id
                          ? "bg-muted text-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {tab.label}
                      <span
                        className={cn(
                          "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs",
                          statusFilter === tab.id
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
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 border-b border-border/30 px-4 py-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-smooth",
                  viewMode === "grid"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-smooth",
                  viewMode === "table"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No listings found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Get started by creating your first listing"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleNewListing}>
                    <Plus className="h-4 w-4" />
                    Create Listing
                  </Button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="relative aspect-[16/10]">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                      <Badge
                        className={cn(
                          "absolute left-3 top-3 capitalize",
                          getStatusColor(listing.status)
                        )}
                      >
                        {listing.status}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-foreground line-clamp-1">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {listing.address}
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-2">
                        {formatPrice(listing.price)}
                      </p>

                      {listing.platforms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {listing.platforms.slice(0, 3).map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                          {listing.platforms.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{listing.platforms.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {listing.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {listing.inquiries}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(listing)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDuplicate(listing)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchive(listing)}>
                              <Archive className="mr-2 h-4 w-4" />
                              {listing.status === "archived" ? "Unarchive" : "Archive"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(listing)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Platforms</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="h-10 w-14 rounded-md object-cover"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate max-w-[200px]">
                                {listing.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {listing.address}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn("capitalize", getStatusColor(listing.status))}
                          >
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(listing.price)}
                        </TableCell>
                        <TableCell>
                          {listing.platforms.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {listing.platforms.slice(0, 2).map((platform) => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                              {listing.platforms.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{listing.platforms.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              {listing.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3.5 w-3.5" />
                              {listing.inquiries}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(listing)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(listing)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchive(listing)}>
                                <Archive className="mr-2 h-4 w-4" />
                                {listing.status === "archived" ? "Unarchive" : "Archive"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(listing)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}
