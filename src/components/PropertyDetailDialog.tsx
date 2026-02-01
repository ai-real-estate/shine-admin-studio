import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BadgeCheck,
  Building2,
  Bed,
  Bath,
  Square,
  PawPrint,
  Wifi,
  Car,
  MapPin,
  LayoutGrid,
  ChevronLeft,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images: string[];
  features: string[];
  petFriendly: boolean;
  verified: boolean;
  coordinates: { x: number; y: number };
}

interface PropertyDetailDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

const featureIcons: Record<string, React.ReactNode> = {
  Wifi: <Wifi className="h-3 w-3" />,
  Parking: <Car className="h-3 w-3" />,
};

export function PropertyDetailDialog({
  property,
  open,
  onOpenChange,
}: PropertyDetailDialogProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!property) return null;

  const allImages = [property.image, ...property.images];
  const displayImages = allImages.slice(0, 5);

  // Reset view when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShowAllPhotos(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden p-0 max-h-[90vh]">
        <ScrollArea className="max-h-[90vh]">
          {showAllPhotos ? (
            /* Gallery View */
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to listing
                </button>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                    More
                  </button>
                </div>
              </div>

              {/* Main Content with Sidebar */}
              <div className="flex">
                {/* Photos Section */}
                <div className="flex-1 p-4 space-y-1">
                  {/* Main Large Image */}
                  <img
                    src={allImages[0]}
                    alt={property.title}
                    className="w-full h-auto rounded-lg object-cover"
                    style={{ maxHeight: "500px" }}
                  />

                  {/* Additional Photos Section */}
                  {allImages.length > 1 && (
                    <div className="pt-4">
                      <h3 className="text-lg font-semibold mb-3">Additional photos</h3>
                      <div className="space-y-1">
                        {/* Render photos in a pattern: full width, then pairs */}
                        {allImages.slice(1).map((img, index) => {
                          const position = index % 3;
                          
                          // Full width image (every 3rd starting from 0)
                          if (position === 0) {
                            return (
                              <img
                                key={index}
                                src={img}
                                alt={`${property.title} ${index + 2}`}
                                className="w-full h-auto rounded-lg object-cover"
                                style={{ maxHeight: "400px" }}
                              />
                            );
                          }
                          
                          // First of a pair
                          if (position === 1) {
                            const nextImg = allImages[index + 2];
                            return (
                              <div key={index} className="grid grid-cols-2 gap-1">
                                <img
                                  src={img}
                                  alt={`${property.title} ${index + 2}`}
                                  className="w-full h-48 rounded-lg object-cover"
                                />
                                {nextImg && (
                                  <img
                                    src={nextImg}
                                    alt={`${property.title} ${index + 3}`}
                                    className="w-full h-48 rounded-lg object-cover"
                                  />
                                )}
                              </div>
                            );
                          }
                          
                          // Second of pair is already rendered above
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Property Info Sidebar */}
                <div className="w-48 p-4 border-l hidden md:block">
                  <h4 className="font-semibold text-foreground">{property.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-semibold text-foreground">{property.beds}+</span> beds,{" "}
                    <span className="font-semibold text-foreground">{property.baths}+</span> baths,
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{property.sqft.toLocaleString()}+</span> sqft
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Default Detail View */
            <>
              {/* Photo Gallery - Zillow style layout */}
              <div className="grid grid-cols-2 gap-1.5 p-1.5">
                {/* Main Image - Left side, spans 2 rows */}
                <div className="row-span-2">
                  <img
                    src={displayImages[0]}
                    alt={property.title}
                    className="h-full w-full rounded-lg object-cover"
                    style={{ minHeight: "320px" }}
                  />
                </div>
                
                {/* Right side - 2x2 grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
                  {/* Top left thumbnail */}
                  <div className="relative">
                    <img
                      src={displayImages[1]}
                      alt={`${property.title} 2`}
                      className="h-full w-full rounded-lg object-cover"
                      style={{ minHeight: "156px" }}
                    />
                  </div>
                  
                  {/* Top right thumbnail */}
                  <div className="relative">
                    <img
                      src={displayImages[2]}
                      alt={`${property.title} 3`}
                      className="h-full w-full rounded-lg object-cover"
                      style={{ minHeight: "156px" }}
                    />
                  </div>
                  
                  {/* Bottom left thumbnail */}
                  <div className="relative">
                    <img
                      src={displayImages[3]}
                      alt={`${property.title} 4`}
                      className="h-full w-full rounded-lg object-cover"
                      style={{ minHeight: "156px" }}
                    />
                  </div>
                  
                  {/* Bottom right thumbnail with "See all photos" button */}
                  <div className="relative">
                    <img
                      src={displayImages[4]}
                      alt={`${property.title} 5`}
                      className="h-full w-full rounded-lg object-cover"
                      style={{ minHeight: "156px" }}
                    />
                    <button 
                      onClick={() => setShowAllPhotos(true)}
                      className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-foreground shadow-md transition-colors hover:bg-gray-50"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      See all {allImages.length} photos
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="space-y-4 p-6 pt-2">
                {/* Title & Verification */}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {property.title}
                    </h2>
                    {property.verified && (
                      <BadgeCheck className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {property.address}
                  </p>
                </div>

                {/* Price */}
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(property.price)}
                </p>

                {/* Specs */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Bed className="h-4 w-4" />
                    {property.beds} {property.beds === 1 ? "Bed" : "Beds"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4" />
                    {property.baths} {property.baths === 1 ? "Bath" : "Baths"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Square className="h-4 w-4" />
                    {property.sqft.toLocaleString()} sqft
                  </span>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="gap-1.5 rounded-full px-3 py-1"
                  >
                    <Building2 className="h-3 w-3" />
                    {property.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="gap-1.5 rounded-full px-3 py-1"
                  >
                    <Bed className="h-3 w-3" />
                    {property.beds} Beds
                  </Badge>
                  {property.petFriendly && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 rounded-full px-3 py-1"
                    >
                      <PawPrint className="h-3 w-3" />
                      Pet-friendly
                    </Badge>
                  )}
                  {property.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="gap-1.5 rounded-full px-3 py-1"
                    >
                      {featureIcons[feature] || null}
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1">Schedule Tour</Button>
                  <Button variant="outline" className="flex-1">
                    Apply Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
