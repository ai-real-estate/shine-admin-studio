import { useState } from "react";
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
import {
  FileDown,
  Grid3X3,
  Map,
  List,
  ChevronLeft,
  ChevronRight,
  Building2,
  Camera,
  ArrowUpDown,
} from "lucide-react";
import { PropertyDetailDialog } from "./PropertyDetailDialog";
import { cn } from "@/lib/utils";

interface UndervaluedProperty {
  id: string;
  rank: number;
  title: string;
  address: string;
  fullAddress: string;
  price: number;
  pricePerSqm: number;
  area: number;
  areaUnit: "sqft" | "sqm";
  units: number;
  beds: string;
  source: string;
  listingDate: string;
  freshData: boolean;
  image: string | null;
  keyFacts: string[];
  score: number;
  scoreUpside: string;
  scoreRisk: string;
  coordinates: { x: number; y: number };
}

const mockProperties: UndervaluedProperty[] = [
  {
    id: "1",
    rank: 1,
    title: "Luxury Commercial Complex",
    address: "400 Old Peytonsville Rd",
    fullAddress: "400 Old Peytonsville Rd, Franklin, TN 37064",
    price: 4500000,
    pricePerSqm: 3525,
    area: 1276.49,
    areaUnit: "sqm",
    units: 12,
    beds: "Studio",
    source: "MLS",
    listingDate: "Jan 15, 2026",
    freshData: false,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    keyFacts: [
      "Prime location near downtown",
      "Recent renovations completed",
      "Strong rental history",
    ],
    score: 8,
    scoreUpside: "High",
    scoreRisk: "Low",
    coordinates: { x: 25, y: 30 },
  },
  {
    id: "2",
    rank: 2,
    title: "Downtown Office Building",
    address: "1250 Commerce St",
    fullAddress: "1250 Commerce St, Nashville, TN 37203",
    price: 7000000,
    pricePerSqm: 22,
    area: 324522,
    areaUnit: "sqft",
    units: 8,
    beds: "N/A",
    source: "LoopNet",
    listingDate: "Dec 28, 2025",
    freshData: true,
    image: "https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800&q=80",
    keyFacts: [
      "Class A office space",
      "95% occupancy rate",
      "Below market value by 15%",
    ],
    score: 9,
    scoreUpside: "Very High",
    scoreRisk: "Medium",
    coordinates: { x: 45, y: 50 },
  },
  {
    id: "3",
    rank: 3,
    title: "Mixed-Use Development",
    address: "789 Broadway Ave",
    fullAddress: "789 Broadway Ave, Nashville, TN 37201",
    price: 3200000,
    pricePerSqm: 2800,
    area: 1142.86,
    areaUnit: "sqm",
    units: 6,
    beds: "1-2 BR",
    source: "Zillow",
    listingDate: "Jan 10, 2026",
    freshData: true,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    keyFacts: [
      "Ground floor retail space",
      "Residential units above",
      "Growing neighborhood",
    ],
    score: 7,
    scoreUpside: "Medium",
    scoreRisk: "Low",
    coordinates: { x: 60, y: 35 },
  },
  {
    id: "4",
    rank: 4,
    title: "Industrial Warehouse",
    address: "5500 Industrial Blvd",
    fullAddress: "5500 Industrial Blvd, Antioch, TN 37013",
    price: 2800000,
    pricePerSqm: 1200,
    area: 2333.33,
    areaUnit: "sqm",
    units: 1,
    beds: "N/A",
    source: "CoStar",
    listingDate: "Jan 5, 2026",
    freshData: false,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    keyFacts: [
      "High ceiling clearance",
      "Loading docks available",
      "Near major highways",
    ],
    score: 6,
    scoreUpside: "Medium",
    scoreRisk: "Medium",
    coordinates: { x: 75, y: 65 },
  },
  {
    id: "5",
    rank: 5,
    title: "Retail Strip Center",
    address: "2100 Gallatin Pike",
    fullAddress: "2100 Gallatin Pike, Madison, TN 37115",
    price: 1950000,
    pricePerSqm: 1850,
    area: 1054.05,
    areaUnit: "sqm",
    units: 5,
    beds: "N/A",
    source: "Crexi",
    listingDate: "Dec 20, 2025",
    freshData: true,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    keyFacts: [
      "Anchor tenant signed",
      "High traffic location",
      "Value-add opportunity",
    ],
    score: 7,
    scoreUpside: "High",
    scoreRisk: "Medium",
    coordinates: { x: 35, y: 70 },
  },
  {
    id: "6",
    rank: 6,
    title: "Multifamily Apartments",
    address: "850 Charlotte Ave",
    fullAddress: "850 Charlotte Ave, Nashville, TN 37203",
    price: 5500000,
    pricePerSqm: 4100,
    area: 1341.46,
    areaUnit: "sqm",
    units: 24,
    beds: "1-3 BR",
    source: "Apartments.com",
    listingDate: "Jan 12, 2026",
    freshData: false,
    image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80",
    keyFacts: [
      "Strong rental demand",
      "Recently updated units",
      "Professional management",
    ],
    score: 8,
    scoreUpside: "High",
    scoreRisk: "Low",
    coordinates: { x: 50, y: 45 },
  },
];

type ViewMode = "grid" | "map" | "table";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(price);
};

const formatArea = (area: number, unit: "sqft" | "sqm") => {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(area)} ${unit}`;
};

// Convert UndervaluedProperty to PropertyDetailDialog format
const convertToDetailProperty = (property: UndervaluedProperty) => ({
  id: property.id,
  title: property.title,
  address: property.fullAddress,
  price: property.price,
  type: property.beds === "N/A" ? "Commercial" : "Residential",
  beds: property.beds === "N/A" ? 0 : parseInt(property.beds) || 1,
  baths: Math.ceil((property.beds === "N/A" ? 0 : parseInt(property.beds) || 1) / 2) + 1,
  sqft: property.areaUnit === "sqft" ? Math.round(property.area) : Math.round(property.area * 10.764),
  image: property.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
  images: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800",
  ],
  features: property.keyFacts.slice(0, 2),
  petFriendly: false,
  verified: property.freshData,
  coordinates: property.coordinates,
});

export const UndervaluedProperties = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currency] = useState("USD");
  const [areaUnit] = useState<"sqm" | "sqft">("sqm");
  const [selectedProperty, setSelectedProperty] = useState<UndervaluedProperty | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePropertyClick = (property: UndervaluedProperty) => {
    setSelectedProperty(property);
    setDialogOpen(true);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      {/* Left - Title and PDF */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-md font-semibold text-foreground">Undervalued Properties</h1>
          <p className="text-sm text-muted-foreground">
            {mockProperties.length} listings found
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-foreground">
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
      </div>

      {/* Center - View Toggle */}
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
          <List className="h-4 w-4" />
          Table
        </Button>
      </div>

      {/* Right - Currency/Unit Toggles */}
      {/* <div className="flex items-center gap-2">
        <Badge variant="secondary" className="cursor-pointer">
          {currency}
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          {areaUnit === "sqm" ? "m²" : "sqft"}
        </Badge>
      </div> */}
    </div>
  );

  const renderPropertyCard = (property: UndervaluedProperty) => (
    <div
      key={property.id}
      className="border border-border/50 rounded-xl bg-card overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => handlePropertyClick(property)}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[16/10] bg-muted">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <Camera className="h-12 w-12 mb-2" />
            <span className="text-sm">No photo available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Area */}
        <p className="text-sm text-muted-foreground">
          Area: {formatArea(property.area, property.areaUnit)}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-foreground">
          {property.title} - {property.units} units
        </h3>

        {/* Address */}
        <p className="text-sm text-muted-foreground">{property.fullAddress}</p>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {property.source}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {property.listingDate}
          </Badge>
          <Badge
            variant={property.freshData ? "default" : "secondary"}
            className="text-xs"
          >
            Fresh data {property.freshData ? "on" : "off"}
          </Badge>
        </div>

        {/* Price */}
        <div className="pt-2">
          <p className="text-xl font-bold text-foreground">
            {formatPrice(property.price)} {currency}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatPrice(property.pricePerSqm)} {currency}/{areaUnit}
          </p>
        </div>

        {/* Key Facts */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 space-y-2">
          <p className="text-sm font-medium text-foreground">Key facts:</p>
          <ul className="space-y-1">
            {property.keyFacts.map((fact, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {fact}
              </li>
            ))}
          </ul>
          <p className="text-sm">
            <span className="font-medium">Score {property.score}/10</span>
            <span className="text-muted-foreground">
              {" "}
              ({property.scoreUpside} upside, {property.scoreRisk} risk)
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm" onClick={(e) => e.stopPropagation()}>
            Schedule a Tour
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              handlePropertyClick(property);
            }}
          >
            Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 p-1">
      {mockProperties.map(renderPropertyCard)}
    </div>
  );

  const renderMapView = () => (
    <div className="relative h-full min-h-[600px] bg-muted">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Property Markers */}
      {mockProperties.map((property) => (
        <div
          key={property.id}
          className="absolute transform -translate-x-1/2 cursor-pointer"
          style={{
            left: `${property.coordinates.x}%`,
            top: `${property.coordinates.y}%`,
          }}
          onClick={() => handlePropertyClick(property)}
        >
          {/* Rank Badge */}
          <div
            className={`text-center mb-1 ${
              property.rank === 1
                ? "text-orange-500"
                : "text-muted-foreground"
            }`}
          >
            <div
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                property.rank === 1
                  ? "bg-orange-500 text-white"
                  : "bg-muted-foreground/20 text-muted-foreground"
              }`}
            >
              {property.rank === 1 ? "TOP" : ""}
            </div>
            <div className="text-lg font-bold">{property.rank}</div>
          </div>

          {/* Marker */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-background border-2 border-primary rounded-full flex items-center justify-center shadow-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="w-0.5 h-4 bg-primary" />
          </div>

          {/* Info Card */}
          <div className="bg-card border border-border rounded-lg p-2 shadow-lg min-w-[140px] mt-1">
            <p className="text-xs font-medium truncate">{property.address}</p>
            <p className="text-xs text-muted-foreground truncate">
              {property.fullAddress.split(",").slice(1).join(",")}
            </p>
          </div>

          {/* Price Badge */}
          <div
            className={`mt-1 text-center text-xs font-bold px-3 py-1 rounded-full ${
              property.rank === 1
                ? "bg-orange-500 text-white"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {formatPrice(property.price)} {currency}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                Price
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                Area
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                Price/{areaUnit}
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Beds</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockProperties.map((property) => (
            <TableRow 
              key={property.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handlePropertyClick(property)}
            >
              <TableCell className="font-medium">{property.rank}</TableCell>
              <TableCell className="font-medium">{property.title}</TableCell>
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                {property.fullAddress}
              </TableCell>
              <TableCell>
                {formatPrice(property.price)} {currency}
              </TableCell>
              <TableCell>{formatArea(property.area, property.areaUnit)}</TableCell>
              <TableCell>
                {formatPrice(property.pricePerSqm)} {currency}/{areaUnit}
              </TableCell>
              <TableCell>{property.beds}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {renderHeader()}
      <ScrollArea className="flex-1">
        {viewMode === "grid" && renderGridView()}
        {viewMode === "map" && renderMapView()}
        {viewMode === "table" && renderTableView()}
      </ScrollArea>
      
      <PropertyDetailDialog
        property={selectedProperty ? convertToDetailProperty(selectedProperty) : null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};
