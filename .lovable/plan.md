

# Rental Analytics V2 Component Implementation

Create a new "Rental Analytics V2" component that reuses styles and patterns from PropertyListing, PropertyValuation, UndervaluedProperties, and GenerateListing components, while utilizing the same data structure from RentAnalytics for Miami rent data.

## Overview

The RentAnalyticsV2 component will provide agents with:
1. Light-themed design matching other components (vs dark theme of RentAnalytics)
2. Grid/Map/Table view toggle (from PropertyListing and UndervaluedProperties)
3. Estimation cards layout (from PropertyValuation)
4. Sortable neighborhood table with property-style cards
5. PDF export and currency/unit toggles
6. Interactive data visualization with existing patterns

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/RentAnalyticsV2.tsx` | Create | New rental analytics component with light theme |
| `src/pages/ChatWorkspace.tsx` | Modify | Add keyword detection for "rental analytics" |

## Component Layout

```text
RentAnalyticsV2
+------------------------------------------------------------+
| Header (PropertyListing style)                              |
| [TrendingUp] Rental Analytics    [Grid][Map][Table] [USD]  |
|              5 neighborhoods                   [PDF]        |
+------------------------------------------------------------+
|                                                             |
| Estimation Section (PropertyValuation style)                |
| +-------------------------+ +-------------------------+     |
| | Average Rent (1BR)      | | Average Rent (2BR)      |    |
| | $2,850/mo               | | $3,450/mo               |    |
| | +3.2% YoY               | | +5.1% YoY               |    |
| | [View Details]          | | [View Details]          |    |
| +-------------------------+ +-------------------------+     |
| +-------------------------+                                 |
| | Average Rent (3BR)      |                                |
| | $4,200/mo               |                                |
| | +4.8% YoY               |                                |
| | [View Details]          |                                |
| +-------------------------+                                 |
|                                                             |
| Neighborhood Cards (Grid View - UndervaluedProperties)      |
| +------------------+ +------------------+ +--------------+  |
| | Brickell         | | Downtown         | | Miami Beach  | |
| | [Map grid bg]    | | [Map grid bg]    | | [Map grid]   | |
| |                  | |                  | |              |  |
| | 1BR: $3,200      | | 1BR: $2,900      | | 1BR: $3,500  | |
| | 2BR: $4,100      | | 2BR: $3,700      | | 2BR: $4,500  | |
| | 3BR: $5,500      | | 3BR: $4,800      | | 3BR: $6,200  | |
| |                  | |                  | |              |  |
| | YoY: +6.2%       | | YoY: +4.5%       | | YoY: +7.1%   | |
| | [View Trends]    | | [View Trends]    | | [View...]    | |
| +------------------+ +------------------+ +--------------+  |
|                                                             |
| Table View (PropertyValuation table style)                  |
| +----------------------------------------------------------+|
| | Neighborhood | 1BR    | 2BR    | 3BR    | YoY   | Trend ||
| | Brickell     | $3,200 | $4,100 | $5,500 | +6.2% | [bar] ||
| | Downtown     | $2,900 | $3,700 | $4,800 | +4.5% | [bar] ||
| | Miami Beach  | $3,500 | $4,500 | $6,200 | +7.1% | [bar] ||
| | Coral Gables | $2,700 | $3,400 | $4,400 | +3.8% | [bar] ||
| | Wynwood      | $2,600 | $3,200 | $4,100 | +5.2% | [bar] ||
| +----------------------------------------------------------+|
|                                                             |
| Price Trend Section (simplified from RentAnalytics)         |
| Historical trend with mini sparkline per neighborhood       |
+------------------------------------------------------------+
```

## Reused Patterns from Existing Components

### From PropertyListing
- Header layout with view toggle buttons (Grid/Map/Table)
- Grid view card structure
- Map view with coordinate-based markers
- Table view with sortable columns
- `bg-background` light theme

### From PropertyValuation
- Estimation cards with price and percentage change
- Grid layout for metric cards (`grid-cols-2 gap-4`)
- Bordered cards with rounded corners (`border border-border rounded-xl p-4 bg-card`)
- Property details list style (`flex justify-between py-2 border-b`)
- Section headers (`text-lg font-semibold mb-2`)

### From UndervaluedProperties
- Property cards with rank indicators
- Currency and unit badge toggles
- Key facts section with bullet points
- Score/rating badges
- Map view markers with info tooltips

### From GenerateListing
- Status badges
- Edit/Preview tab toggle pattern
- Action footer with multiple buttons

## Data Structure (Reused from RentAnalytics)

```typescript
// Neighborhood data from RentAnalytics
const neighborhoodData = [
  { name: "Brickell", oneBed: 3200, twoBed: 4100, threeBed: 5500, yoyChange: 6.2 },
  { name: "Downtown", oneBed: 2900, twoBed: 3700, threeBed: 4800, yoyChange: 4.5 },
  { name: "Miami Beach", oneBed: 3500, twoBed: 4500, threeBed: 6200, yoyChange: 7.1 },
  { name: "Coral Gables", oneBed: 2700, twoBed: 3400, threeBed: 4400, yoyChange: 3.8 },
  { name: "Wynwood", oneBed: 2600, twoBed: 3200, threeBed: 4100, yoyChange: 5.2 },
];

// Bedroom stats summary
const bedroomStats = [
  { type: "1-Bedroom", avgRent: 2850, yoyChange: 3.2 },
  { type: "2-Bedroom", avgRent: 3450, yoyChange: 5.1 },
  { type: "3-Bedroom", avgRent: 4200, yoyChange: 4.8 },
];

// Historical data for sparklines (simplified from RentAnalytics)
const historicalData = generateHistoricalData(); // 24 months
```

## Implementation Details

### Header Section (PropertyListing pattern)
```tsx
<div className="flex items-center justify-between border-b border-border px-6 py-4">
  <div>
    <h1 className="text-md font-semibold text-foreground">Rental Analytics</h1>
    <p className="text-sm text-muted-foreground">5 neighborhoods</p>
  </div>
  <div className="flex items-center rounded-lg border border-border bg-card p-1 gap-1">
    {/* Grid/Map/Table toggle buttons */}
  </div>
  <div className="flex items-center gap-2">
    <Badge variant="secondary">USD</Badge>
    <Button variant="outline" size="sm"><FileDown /> PDF</Button>
  </div>
</div>
```

### Summary Cards (PropertyValuation pattern)
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {bedroomStats.map(stat => (
    <div className="border border-border rounded-xl p-4 bg-card">
      <p className="text-sm text-muted-foreground">{stat.type}</p>
      <p className="text-2xl font-bold">${stat.avgRent}/mo</p>
      <Badge variant={stat.yoyChange >= 0 ? "default" : "destructive"}>
        {stat.yoyChange >= 0 ? "+" : ""}{stat.yoyChange}% YoY
      </Badge>
    </div>
  ))}
</div>
```

### Grid View (UndervaluedProperties card pattern)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
  {neighborhoodData.map(neighborhood => (
    <div className="border border-border/50 rounded-xl bg-card overflow-hidden">
      {/* Map placeholder with grid pattern */}
      <div className="relative aspect-[16/10] bg-muted">
        {/* Grid pattern background */}
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold">{neighborhood.name}</h3>
        {/* Price list */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>1BR</span>
            <span className="font-medium">${neighborhood.oneBed}</span>
          </div>
          {/* 2BR, 3BR... */}
        </div>
        <Badge>{neighborhood.yoyChange}% YoY</Badge>
        <Button variant="outline" size="sm" className="w-full">View Trends</Button>
      </div>
    </div>
  ))}
</div>
```

### Map View (PropertyListing/UndervaluedProperties pattern)
```tsx
<div className="relative h-full min-h-[500px] bg-muted/30">
  {/* Grid pattern background */}
  <div className="absolute left-4 top-4 z-10 rounded-lg border bg-card px-4 py-2">
    Miami Area
  </div>
  {neighborhoods.map(n => (
    <div style={{ left: `${n.coordinates.x}%`, top: `${n.coordinates.y}%` }}>
      {/* Marker with price tooltip */}
    </div>
  ))}
</div>
```

### Table View (PropertyValuation table pattern)
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead onClick={() => handleSort("name")}>Neighborhood</TableHead>
      <TableHead onClick={() => handleSort("oneBed")}>1BR</TableHead>
      <TableHead onClick={() => handleSort("twoBed")}>2BR</TableHead>
      <TableHead onClick={() => handleSort("threeBed")}>3BR</TableHead>
      <TableHead onClick={() => handleSort("yoyChange")}>YoY Change</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sortedData.map(n => (
      <TableRow>
        <TableCell className="font-medium">{n.name}</TableCell>
        <TableCell>${n.oneBed}</TableCell>
        {/* ... */}
        <TableCell>
          <Badge variant={n.yoyChange >= 0 ? "default" : "destructive"}>
            {n.yoyChange}%
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## ChatWorkspace Integration

Add new keyword for "rental analytics v2":

```typescript
const RENT_ANALYTICS_V2_KEYWORDS = ["rental analytics"];

const [showRentAnalyticsV2, setShowRentAnalyticsV2] = useState(
  RENT_ANALYTICS_V2_KEYWORDS.some(kw => lowerPrompt.includes(kw))
);
```

Update `handleChatMessage` and `renderRightPanel` accordingly.

## Technical Notes

- Light theme using standard Tailwind classes (bg-background, bg-card, text-foreground)
- Reuses existing UI components: Card, Badge, Button, Table, ScrollArea
- View toggle between Grid, Map, Table like PropertyListing
- Sortable table columns with click-to-sort headers
- PDF export via browser print with print-specific styles
- Currency badge (USD) for consistency
- Map coordinates assigned to each neighborhood for map view
- Mini sparkline charts using simplified Recharts components

