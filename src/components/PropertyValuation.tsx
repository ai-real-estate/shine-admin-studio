import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
  import { MapPin, Bed, Bath, Square, Calendar, FileDown, Calculator } from "lucide-react";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US").format(price);
};

const valuationData = {
  estimatedPrice: 9503759,
  pricePerSqft: 1411,
  estimatedRent: 360902,
  rentalROI: 3.9,
  address: "123 Main Street, New York, NY 10001",
  yearBuilt: 1860,
  floors: 4,
  area: 6735,
  price: 9223058,
  propertyName: "Historic Commercial Building",
  valuationReport: {
    lowCase: "£7,500,000",
    centralCase: "£8,250,000",
    highCase: "£9,000,000",
  },
  assumptions: [
    "Freehold with vacant possession",
    "Property in good condition with no major defects",
    "Planning permission for current use",
    "No environmental issues",
  ],
  incomeMetrics: {
    keys: 45,
    occupancy: "75%",
    adr: "£185",
    revPAR: "£138.75",
    roomRevenue: "£2,280,094",
    totalRevenue: "£3,040,125",
    ebitdaMargin: "35%",
    ebitda: "£1,064,044",
    capRates: { low: "5.5%", central: "6.0%", high: "6.5%" },
  },
  reviews: [
    {
      source: "TripAdvisor",
      author: "John D.",
      date: "2024-01-15",
      sentiment: "Positive",
      quote: "Excellent location and beautiful historic building. Staff was very helpful.",
    },
    {
      source: "Google",
      author: "Sarah M.",
      date: "2024-01-10",
      sentiment: "Positive",
      quote: "Great experience overall. The property has so much character.",
    },
    {
      source: "Booking.com",
      author: "Mike R.",
      date: "2024-01-05",
      sentiment: "Neutral",
      quote: "Good value for money. Some areas could use updating.",
    },
  ],
  similarProperties: [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
      beds: 0,
      baths: 4,
      sqft: 5200,
      title: "Commercial Office Building",
      address: "456 Park Avenue",
      badge: "For Sale",
      date: "Listed 2 weeks ago",
      price: 8500000,
      pricePerSqft: 1635,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      beds: 0,
      baths: 6,
      sqft: 7800,
      title: "Mixed-Use Development",
      address: "789 Broadway",
      badge: "New Listing",
      date: "Listed 3 days ago",
      price: 12200000,
      pricePerSqft: 1564,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1464938050520-ef2571c6f6d4?w=400",
      beds: 0,
      baths: 3,
      sqft: 4500,
      title: "Retail Space Downtown",
      address: "321 Fifth Avenue",
      badge: "Price Reduced",
      date: "Listed 1 month ago",
      price: 6750000,
      pricePerSqft: 1500,
    },
  ],
};

export function PropertyValuation() {
  const handleExportPDF = () => {
    window.print();
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      {/* Left - Title and Subtitle */}
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-md font-semibold text-foreground">Property Valuation</h1>
          <p className="text-sm text-muted-foreground">{valuationData.address}</p>
        </div>
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

  return (
    <div className="flex h-full flex-col bg-background">
      {renderHeader()}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">
          {/* Estimation Section */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Estimation</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Based on market data, comparable sales, and property features, we've estimated the following values.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Estimated Price Card */}
              <div className="border border-border rounded-xl p-4 bg-card">
                <p className="text-sm text-muted-foreground mb-1">Estimated Price</p>
                <p className="text-2xl font-bold">{formatPrice(valuationData.estimatedPrice)} USD</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {formatPrice(valuationData.pricePerSqft)} USD/sqft
                </p>
                <Button className="w-full" size="sm">
                  List for sale
                </Button>
              </div>
              {/* Estimated Rent Card */}
              <div className="border border-border rounded-xl p-4 bg-card">
                <p className="text-sm text-muted-foreground mb-1">Estimated Rent (12 months)</p>
                <p className="text-2xl font-bold">{formatPrice(valuationData.estimatedRent)} USD</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Rental ROI: {valuationData.rentalROI}%
                </p>
                <Button className="w-full" size="sm">
                  List for rent
                </Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* Property Section */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Property</h2>
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {valuationData.address}
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Year of construction</span>
                  <span className="text-sm font-medium">{valuationData.yearBuilt}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Floors count</span>
                  <span className="text-sm font-medium">{valuationData.floors}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Area</span>
                  <span className="text-sm font-medium">{formatPrice(valuationData.area)} sqft</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-medium">{formatPrice(valuationData.price)} USD</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Price per sqft</span>
                  <span className="text-sm font-medium">{formatPrice(Math.round(valuationData.price / valuationData.area))} USD/sqft</span>
                </div>
              </div>
              {/* Map Placeholder */}
              <div className="rounded-xl border border-border bg-muted/30 flex items-center justify-center min-h-[160px]">
                <div 
                  className="w-full h-full rounded-xl"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                      linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* About the Property */}
          <section>
            <h2 className="text-lg font-semibold mb-2">About the Property</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Key details and features of this {valuationData.propertyName}.
            </p>
          </section>

          {/* Valuation Report */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">Hotel - Commercial Valuation Report</h3>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">1. Estimated Current Market Value (Freehold)</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-border rounded-lg p-3 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Low Case</p>
                  <p className="text-lg font-semibold">{valuationData.valuationReport.lowCase}</p>
                </div>
                <div className="border border-border rounded-lg p-3 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Central Case</p>
                  <p className="text-lg font-semibold">{valuationData.valuationReport.centralCase}</p>
                </div>
                <div className="border border-border rounded-lg p-3 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">High Case</p>
                  <p className="text-lg font-semibold">{valuationData.valuationReport.highCase}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Assumptions:</p>
                <ul className="list-disc list-inside space-y-1">
                  {valuationData.assumptions.map((assumption, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{assumption}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Income-Driven Metrics */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">3. Income-Driven Metrics and Cap Rates</h3>
            
            <div>
              <p className="text-sm font-medium mb-3">Key Operating Assumptions:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Number of Keys</span>
                  <span className="text-sm font-medium">{valuationData.incomeMetrics.keys}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Stabilized Occupancy</span>
                  <span className="text-sm font-medium">{valuationData.incomeMetrics.occupancy}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">ADR</span>
                  <span className="text-sm font-medium">{valuationData.incomeMetrics.adr}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">RevPAR</span>
                  <span className="text-sm font-medium">{valuationData.incomeMetrics.revPAR}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Room Revenue Calculations:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Room Revenue</span>
                  <span className="text-sm font-medium">{valuationData.incomeMetrics.roomRevenue}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="text-sm font-medium">{valuationData.incomeMetrics.totalRevenue}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">EBITDA Margin</span>
                  <span className="text-sm font-medium">{valuationData.incomeMetrics.ebitdaMargin}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">EBITDA</span>
                  <span className="text-sm font-medium">{valuationData.incomeMetrics.ebitda}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Cap Rates:</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-border rounded-lg p-3 bg-card text-center">
                  <p className="text-xs text-muted-foreground mb-1">Low</p>
                  <p className="text-lg font-semibold">{valuationData.incomeMetrics.capRates.low}</p>
                </div>
                <div className="border border-border rounded-lg p-3 bg-card text-center">
                  <p className="text-xs text-muted-foreground mb-1">Central</p>
                  <p className="text-lg font-semibold">{valuationData.incomeMetrics.capRates.central}</p>
                </div>
                <div className="border border-border rounded-lg p-3 bg-card text-center">
                  <p className="text-xs text-muted-foreground mb-1">High</p>
                  <p className="text-lg font-semibold">{valuationData.incomeMetrics.capRates.high}</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Social Mentions & Reviews */}
          <section>
            <h3 className="text-base font-semibold mb-4">Social Mentions & Reviews</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Quote</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valuationData.reviews.map((review, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{review.source}</TableCell>
                    <TableCell>{review.author}</TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={review.sentiment === "Positive" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {review.sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{review.quote}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          <Separator />

          {/* Similar Properties */}
          <section>
            <h3 className="text-base font-semibold mb-4">Similar Properties</h3>
            <div className="grid grid-cols-3 gap-4">
              {valuationData.similarProperties.map((property) => (
                <div key={property.id} className="border border-border rounded-xl overflow-hidden bg-card">
                  <div className="relative aspect-[4/3]">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 text-xs">{property.badge}</Badge>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        {property.baths}
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-3 w-3" />
                        {formatPrice(property.sqft)} sqft
                      </span>
                    </div>
                    <h4 className="text-sm font-medium line-clamp-1">{property.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.address}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {property.date}
                    </p>
                    <div className="pt-2 border-t border-border">
                      <p className="text-base font-bold">${formatPrice(property.price)}</p>
                      <p className="text-xs text-muted-foreground">
                        ${formatPrice(property.pricePerSqft)}/sqft
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
