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
  if (!property) return null;

  const allImages = [property.image, ...property.images];
  const displayImages = allImages.slice(0, 5);
  const remainingCount = allImages.length - 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden p-0 max-h-[90vh]">
        <ScrollArea className="max-h-[90vh]">
        {/* Photo Gallery */}
        <div className="grid grid-cols-3 gap-1 p-1">
          {/* Main Image */}
          <div className="col-span-2 row-span-2">
            <img
              src={displayImages[0]}
              alt={property.title}
              className="h-full w-full rounded-lg object-cover"
              style={{ minHeight: "280px" }}
            />
          </div>
          {/* Thumbnail Grid */}
          {displayImages.slice(1, 5).map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt={`${property.title} ${index + 2}`}
                className="h-full w-full rounded-lg object-cover"
                style={{ minHeight: "138px" }}
              />
              {index === 3 && remainingCount > 0 && (
                <button className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-sm font-medium text-white transition-colors hover:bg-black/60">
                  See all {allImages.length} photos
                </button>
              )}
            </div>
          ))}
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
