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
  TrendingUp,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "map" | "table";

// Miami neighborhood data (from RentAnalytics)
const neighborhoodData = [
  { 
    name: "Brickell", 
    oneBed: 3200, 
    twoBed: 4100, 
    threeBed: 5500, 
    yoyChange: 6.2,
    coordinates: { x: 45, y: 55 },
  },
  { 
    name: "Downtown", 
    oneBed: 2900, 
    twoBed: 3700, 
    threeBed: 4800, 
    yoyChange: 4.5,
    coordinates: { x: 50, y: 40 },
  },
  { 
    name: "Miami Beach", 
    oneBed: 3500, 
    twoBed: 4500, 
    threeBed: 6200, 
    yoyChange: 7.1,
    coordinates: { x: 75, y: 35 },
  },
  { 
    name: "Coral Gables", 
    oneBed: 2700, 
    twoBed: 3400, 
    threeBed: 4400, 
    yoyChange: 3.8,
    coordinates: { x: 30, y: 65 },
  },
  { 
    name: "Wynwood", 
    oneBed: 2600, 
    twoBed: 3200, 
    threeBed: 4100, 
    yoyChange: 5.2,
    coordinates: { x: 55, y: 30 },
  },
];

// Bedroom stats summary
const bedroomStats = [
  { type: "1-Bedroom", avgRent: 2850, yoyChange: 3.2 },
  { type: "2-Bedroom", avgRent: 3450, yoyChange: 5.1 },
  { type: "3-Bedroom", avgRent: 4200, yoyChange: 4.8 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const RentAnalyticsV2 = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleExportPDF = () => {
    window.print();
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedNeighborhoodData = [...neighborhoodData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];
    if (typeof aValue === "string" && typeof bValue === "string") {
      const modifier = sortDirection === "asc" ? 1 : -1;
      return aValue.localeCompare(bValue) * modifier;
    }
    const modifier = sortDirection === "asc" ? 1 : -1;
    return ((aValue as number) - (bValue as number)) * modifier;
  });

  const renderHeader = () => (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      {/* Left - Title and PDF */}
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-md font-semibold text-foreground">Rental Analytics</h1>
          <p className="text-sm text-muted-foreground">
            {neighborhoodData.length} neighborhoods
          </p>
        </div>
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

      {/* Right - Currency & Export */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">USD</Badge>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPDF}>
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
      </div>
    </div>
  );

  const renderSummaryCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {bedroomStats.map((stat) => (
        <div
          key={stat.type}
          className="border border-border rounded-xl p-4 bg-card"
        >
          <p className="text-sm text-muted-foreground mb-1">{stat.type}</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(stat.avgRent)}/mo
          </p>
          <div className="flex items-center gap-1 mt-2">
            {stat.yoyChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-primary" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            )}
            <Badge
              variant={stat.yoyChange >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {stat.yoyChange >= 0 ? "+" : ""}
              {stat.yoyChange}% YoY
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            View Details
          </Button>
        </div>
      ))}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {neighborhoodData.map((neighborhood) => (
        <div
          key={neighborhood.name}
          className="border border-border/50 rounded-xl bg-card overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
        >
          {/* Map placeholder with grid pattern */}
          <div className="relative aspect-[16/10] bg-muted/30">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground">{neighborhood.name}</h3>

            {/* Price list */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">1BR</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(neighborhood.oneBed)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">2BR</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(neighborhood.twoBed)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">3BR</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(neighborhood.threeBed)}
                </span>
              </div>
            </div>

            {/* YoY Badge */}
            <div className="flex items-center gap-1">
              {neighborhood.yoyChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-primary" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
              <Badge
                variant={neighborhood.yoyChange >= 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {neighborhood.yoyChange >= 0 ? "+" : ""}
                {neighborhood.yoyChange}% YoY
              </Badge>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              View Trends
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMapView = () => (
    <div className="relative h-full min-h-[500px] bg-muted/30">
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

      {/* Location Label */}
      <div className="absolute left-4 top-4 z-10 rounded-lg border border-border bg-card px-4 py-2 shadow-soft flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Miami Area</span>
      </div>

      {/* Neighborhood Markers */}
      {neighborhoodData.map((neighborhood) => (
        <div
          key={neighborhood.name}
          className="absolute transform -translate-x-1/2 cursor-pointer group"
          style={{
            left: `${neighborhood.coordinates.x}%`,
            top: `${neighborhood.coordinates.y}%`,
          }}
        >
          {/* Marker */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-card border-2 border-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="w-0.5 h-4 bg-primary" />
          </div>

          {/* Info Card */}
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[160px] mt-1">
            <p className="text-sm font-semibold text-foreground">{neighborhood.name}</p>
            <div className="space-y-1 mt-2">
              <p className="text-xs text-muted-foreground">
                1BR: {formatCurrency(neighborhood.oneBed)}
              </p>
              <p className="text-xs text-muted-foreground">
                2BR: {formatCurrency(neighborhood.twoBed)}
              </p>
              <p className="text-xs text-muted-foreground">
                3BR: {formatCurrency(neighborhood.threeBed)}
              </p>
            </div>
            <Badge
              variant={neighborhood.yoyChange >= 0 ? "default" : "destructive"}
              className="text-xs mt-2"
            >
              {neighborhood.yoyChange >= 0 ? "+" : ""}
              {neighborhood.yoyChange}% YoY
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:text-foreground"
              onClick={() => handleSort("name")}
            >
              Neighborhood
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground text-right"
              onClick={() => handleSort("oneBed")}
            >
              1BR
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground text-right"
              onClick={() => handleSort("twoBed")}
            >
              2BR
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground text-right"
              onClick={() => handleSort("threeBed")}
            >
              3BR
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-foreground text-right"
              onClick={() => handleSort("yoyChange")}
            >
              YoY Change
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedNeighborhoodData.map((neighborhood) => (
            <TableRow key={neighborhood.name} className="cursor-pointer">
              <TableCell className="font-medium">{neighborhood.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(neighborhood.oneBed)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(neighborhood.twoBed)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(neighborhood.threeBed)}
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={neighborhood.yoyChange >= 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {neighborhood.yoyChange >= 0 ? "+" : ""}
                  {neighborhood.yoyChange}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {renderHeader()}

      <ScrollArea className="flex-1">
        {/* Summary Cards */}
        {renderSummaryCards()}

        {/* Content based on view mode */}
        {viewMode === "grid" && renderGridView()}
        {viewMode === "map" && renderMapView()}
        {viewMode === "table" && renderTableView()}
      </ScrollArea>
    </div>
  );
};
