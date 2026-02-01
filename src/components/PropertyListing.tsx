import { useState } from "react";
import { Grid3X3, Map, Table2, Bed, Bath, Square, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "map" | "table";

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
  coordinates: { x: number; y: number };
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Loft",
    address: "123 Main St, New York, NY 10001",
    price: 850000,
    type: "Condo",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    coordinates: { x: 25, y: 30 },
  },
  {
    id: "2",
    title: "Cozy Brooklyn Brownstone",
    address: "456 Park Ave, Brooklyn, NY 11201",
    price: 1250000,
    type: "Townhouse",
    beds: 4,
    baths: 3,
    sqft: 2400,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    coordinates: { x: 55, y: 45 },
  },
  {
    id: "3",
    title: "Luxury Penthouse Suite",
    address: "789 5th Ave, New York, NY 10022",
    price: 3500000,
    type: "Penthouse",
    beds: 3,
    baths: 3.5,
    sqft: 3200,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    coordinates: { x: 75, y: 25 },
  },
  {
    id: "4",
    title: "Charming Village Studio",
    address: "321 W 4th St, New York, NY 10014",
    price: 495000,
    type: "Studio",
    beds: 1,
    baths: 1,
    sqft: 550,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    coordinates: { x: 30, y: 60 },
  },
  {
    id: "5",
    title: "Spacious Family Home",
    address: "555 Oak Lane, Queens, NY 11375",
    price: 975000,
    type: "House",
    beds: 5,
    baths: 4,
    sqft: 3800,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    coordinates: { x: 50, y: 50 },
  },
  {
    id: "6",
    title: "Waterfront Apartment",
    address: "888 River Rd, Jersey City, NJ 07310",
    price: 725000,
    type: "Condo",
    beds: 2,
    baths: 2,
    sqft: 1100,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    coordinates: { x: 70, y: 65 },
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
  }
  return `$${(price / 1000).toFixed(0)}K`;
}

export function PropertyListing() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Properties</h1>
          <p className="text-sm text-muted-foreground">
            {mockProperties.length} listings found
          </p>
        </div>
        <div className="flex items-center rounded-lg border border-border bg-card p-1 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 rounded-md px-3",
              viewMode === "grid" && "bg-muted"
            )}
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 rounded-md px-3",
              viewMode === "map" && "bg-muted"
            )}
            onClick={() => setViewMode("map")}
          >
            <Map className="h-4 w-4" />
            Map
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 rounded-md px-3",
              viewMode === "table" && "bg-muted"
            )}
            onClick={() => setViewMode("table")}
          >
            <Table2 className="h-4 w-4" />
            Table
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {viewMode === "grid" && <GridView properties={mockProperties} />}
        {viewMode === "map" && <MapView properties={mockProperties} />}
        {viewMode === "table" && <TableView properties={mockProperties} />}
      </ScrollArea>
    </div>
  );
}

function GridView({ properties }: { properties: Property[] }) {
  return (
    <div className="grid grid-cols-1 gap-1 p-1 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <div
          key={property.id}
          className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-card"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <Badge className="absolute left-3 top-3 bg-card/90 text-foreground backdrop-blur-sm hover:bg-card/90">
              {property.type}
            </Badge>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-foreground">{property.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {property.address}
            </p>
            <p className="mt-2 text-lg font-bold text-foreground">
              {formatPrice(property.price)}
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.beds}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.baths}
              </span>
              <span className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                {property.sqft.toLocaleString()} sqft
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapView({ properties }: { properties: Property[] }) {
  return (
    <div className="relative h-full min-h-[500px] bg-muted/30">
      {/* Map grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Location label */}
      <div className="absolute left-4 top-4 z-10 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft">
        New York City Area
      </div>

      {/* Property markers */}
      {properties.map((property) => (
        <div
          key={property.id}
          className="absolute z-10 cursor-pointer transition-transform hover:scale-110"
          style={{
            left: `${property.coordinates.x}%`,
            top: `${property.coordinates.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 shadow-soft">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {formatPriceShort(property.price)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TableView({ properties }: { properties: Property[] }) {
  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Property</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Beds</TableHead>
            <TableHead className="text-right">Baths</TableHead>
            <TableHead className="text-right">Sqft</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id} className="cursor-pointer">
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <span className="font-medium">{property.title}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {property.address}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {property.type}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatPrice(property.price)}
              </TableCell>
              <TableCell className="text-right">{property.beds}</TableCell>
              <TableCell className="text-right">{property.baths}</TableCell>
              <TableCell className="text-right">
                {property.sqft.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
