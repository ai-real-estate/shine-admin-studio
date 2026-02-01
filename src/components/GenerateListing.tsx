import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  MapPin,
  Bed,
  Bath,
  Square,
  X,
  Building,
  Home,
  Store,
  Landmark,
  Globe,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GeneratedListing {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "House" | "Condo" | "Townhouse" | "Apartment" | "Commercial";
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  features: string[];
  images: string[];
  status: "draft" | "ready" | "published";
}

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  selected: boolean;
}

const INITIAL_PLATFORMS: Platform[] = [
  { id: "mls", name: "MLS", icon: <Building className="h-4 w-4" />, selected: true },
  { id: "zillow", name: "Zillow", icon: <Home className="h-4 w-4" />, selected: true },
  { id: "realtor", name: "Realtor.com", icon: <Store className="h-4 w-4" />, selected: true },
  { id: "redfin", name: "Redfin", icon: <Landmark className="h-4 w-4" />, selected: true },
  { id: "trulia", name: "Trulia", icon: <Globe className="h-4 w-4" />, selected: false },
  { id: "apartments", name: "Apartments.com", icon: <Building className="h-4 w-4" />, selected: false },
  { id: "loopnet", name: "LoopNet", icon: <Store className="h-4 w-4" />, selected: false },
  { id: "craigslist", name: "Craigslist", icon: <Globe className="h-4 w-4" />, selected: false },
];

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
];

const INITIAL_LISTING: GeneratedListing = {
  id: "new-listing",
  title: "Modern 3-Bedroom Home with Pool",
  address: "123 Sunset Boulevard, Los Angeles, CA 90028",
  price: 1250000,
  type: "House",
  beds: 3,
  baths: 2,
  sqft: 2400,
  description: "This stunning modern home features an open floor plan with floor-to-ceiling windows, a gourmet kitchen with high-end appliances, and a private backyard oasis with a sparkling pool. Located in a prime neighborhood with easy access to shopping, dining, and entertainment.",
  features: ["Pool", "Modern Kitchen", "Hardwood Floors", "Smart Home", "2-Car Garage"],
  images: MOCK_IMAGES,
  status: "draft",
};

export const GenerateListing = () => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [listing, setListing] = useState<GeneratedListing>(INITIAL_LISTING);
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [platformDialogOpen, setPlatformDialogOpen] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const selectedPlatformCount = platforms.filter((p) => p.selected).length;

  const handleInputChange = (field: keyof GeneratedListing, value: string | number) => {
    setListing((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !listing.features.includes(newFeature.trim())) {
      setListing((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setListing((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleTogglePlatform = (platformId: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === platformId ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleSelectAll = () => {
    setPlatforms((prev) => prev.map((p) => ({ ...p, selected: true })));
  };

  const handleDeselectAll = () => {
    setPlatforms((prev) => prev.map((p) => ({ ...p, selected: false })));
  };

  const handleSaveDraft = () => {
    setListing((prev) => ({ ...prev, status: "draft" }));
    toast.success("Draft saved successfully");
  };

  const handlePublish = () => {
    const selectedPlatforms = platforms.filter((p) => p.selected);
    toast.success(`Listed on ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? "s" : ""}`, {
      description: selectedPlatforms.map((p) => p.name).join(", "),
    });
    setListing((prev) => ({ ...prev, status: "published" }));
    setPlatformDialogOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Generate Listing</h2>
        <Badge
          variant={listing.status === "published" ? "default" : "secondary"}
          className="capitalize text-xs"
        >
          {listing.status}
        </Badge>
      </div>

      <div className="flex items-center gap-1 bg-muted rounded-lg p-1 w-full sm:w-auto">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 sm:flex-none px-4 h-8 text-sm",
            activeTab === "edit" && "bg-background shadow-sm"
          )}
          onClick={() => setActiveTab("edit")}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 sm:flex-none px-4 h-8 text-sm",
            activeTab === "preview" && "bg-background shadow-sm"
          )}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </Button>
      </div>
    </div>
  );

  const renderPhotoGallery = () => (
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50">
      <h3 className="text-sm font-medium text-foreground mb-3">Photos</h3>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
        <button className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-colors flex items-center justify-center">
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
        </button>
        {listing.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setPrimaryImageIndex(index)}
            className={cn(
              "relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-colors",
              primaryImageIndex === index
                ? "border-primary"
                : "border-transparent hover:border-border"
            )}
          >
            <img
              src={image}
              alt={`Property ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {primaryImageIndex === index && (
              <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded">
                Primary
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderEditForm = () => (
    <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Title</label>
        <Input
          value={listing.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="mt-1.5"
          placeholder="Enter property title"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Address</label>
        <div className="relative mt-1.5">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={listing.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="pl-10"
            placeholder="Enter property address"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="text-sm font-medium text-foreground">Price</label>
          <Input
            type="number"
            value={listing.price}
            onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
            className="mt-1.5"
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Type</label>
          <Select
            value={listing.type}
            onValueChange={(value) => handleInputChange("type", value)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div>
          <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1 sm:gap-1.5">
            <Bed className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Beds
          </label>
          <Input
            type="number"
            value={listing.beds}
            onChange={(e) => handleInputChange("beds", parseInt(e.target.value) || 0)}
            className="mt-1.5"
            min={0}
          />
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1 sm:gap-1.5">
            <Bath className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Baths
          </label>
          <Input
            type="number"
            value={listing.baths}
            onChange={(e) => handleInputChange("baths", parseInt(e.target.value) || 0)}
            className="mt-1.5"
            min={0}
          />
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1 sm:gap-1.5">
            <Square className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Sqft
          </label>
          <Input
            type="number"
            value={listing.sqft}
            onChange={(e) => handleInputChange("sqft", parseInt(e.target.value) || 0)}
            className="mt-1.5"
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Description</label>
        <Textarea
          value={listing.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="mt-1.5 min-h-[100px]"
          placeholder="Describe the property..."
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Features</label>
        <div className="flex gap-2 mt-1.5">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
            placeholder="Add a feature"
            className="flex-1"
          />
          <Button onClick={handleAddFeature} size="sm" variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {listing.features.map((feature) => (
            <Badge key={feature} variant="secondary" className="gap-1 pr-1.5 text-xs sm:text-sm">
              {feature}
              <button
                onClick={() => handleRemoveFeature(feature)}
                className="hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="px-4 sm:px-6 py-3 sm:py-4">
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {/* Hero Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={listing.images[primaryImageIndex]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {listing.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setPrimaryImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  primaryImageIndex === index
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-2">{listing.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{listing.address}</span>
              </p>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 sm:text-right flex-shrink-0">
              <div className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(listing.price)}</div>
              <Badge variant="outline" className="sm:mt-1">{listing.type}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-6 py-3 sm:py-4 border-y border-border">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="font-medium text-sm sm:text-base">{listing.beds}</span>
              <span className="text-muted-foreground text-sm sm:text-base">Beds</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Bath className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="font-medium text-sm sm:text-base">{listing.baths}</span>
              <span className="text-muted-foreground text-sm sm:text-base">Baths</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Square className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="font-medium text-sm sm:text-base">{listing.sqft.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm sm:text-base">Sqft</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-foreground mt-4 leading-relaxed">{listing.description}</p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
            {listing.features.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs sm:text-sm">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-t border-border/50 bg-muted/30">
      <Button variant="outline" onClick={handleSaveDraft} className="order-2 sm:order-1">
        Save as Draft
      </Button>
      <Button onClick={() => setPlatformDialogOpen(true)} className="gap-2 order-1 sm:order-2">
        <Share2 className="h-4 w-4" />
        List Property
      </Button>
    </div>
  );

  const renderPlatformDialog = () => (
    <Dialog open={platformDialogOpen} onOpenChange={setPlatformDialogOpen}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Platforms</DialogTitle>
        </DialogHeader>
        <div className="py-2 sm:py-4 flex-1 overflow-hidden">
          <div className="flex justify-between mb-3 sm:mb-4">
            <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs sm:text-sm">
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDeselectAll} className="text-xs sm:text-sm">
              Deselect All
            </Button>
          </div>
          <ScrollArea className="h-[40vh] sm:h-auto sm:max-h-[300px]">
            <div className="space-y-2 sm:space-y-3 pr-2">
              {platforms.map((platform) => (
                <label
                  key={platform.id}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={platform.selected}
                    onCheckedChange={() => handleTogglePlatform(platform.id)}
                  />
                  <span className="text-muted-foreground">{platform.icon}</span>
                  <span className="font-medium text-sm sm:text-base">{platform.name}</span>
                  {platform.selected && (
                    <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setPlatformDialogOpen(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={selectedPlatformCount === 0} className="w-full sm:w-auto">
            Publish to {selectedPlatformCount} platform{selectedPlatformCount !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="h-full flex flex-col bg-card">
      {renderHeader()}
      <ScrollArea className="flex-1">
        {activeTab === "edit" ? (
          <>
            {renderPhotoGallery()}
            {renderEditForm()}
          </>
        ) : (
          renderPreview()
        )}
      </ScrollArea>
      {renderFooter()}
      {renderPlatformDialog()}
    </div>
  );
};
