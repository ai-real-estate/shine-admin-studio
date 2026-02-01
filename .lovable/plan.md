
# Undervalued Properties Component Implementation

Create a new component for displaying undervalued investment properties that will be triggered by the keyword "undervalued" in the chat. The component displays properties in Grid, Map, and Table views with investment-focused data.

## Overview

Based on the reference screenshots, the UndervaluedProperties component will include:

1. **Header**: PDF download button (left), View mode toggle (Grid/Map/Table center), Currency/unit toggles (right)
2. **Grid View**: Investment property cards with images, specs, key facts, and action buttons
3. **Map View**: Interactive map with ranked property markers
4. **Table View**: Sortable data table with investment metrics

## Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `src/components/UndervaluedProperties.tsx` | Create | New component for undervalued property listings |
| `src/pages/ChatWorkspace.tsx` | Modify | Add state and trigger logic for "undervalued" keyword |

## Component Structure

### Grid View Card Layout

```text
+------------------------------------+
|  [<] Image Carousel [>]            |
|   +----------------------------+   |
|   |                            |   |
|   |      Property Image        |   |
|   |                            |   |
|   +----------------------------+   |
|                                    |
|  Area: 1276.49 sqm                 |
|  Property Title - X units          |
|  Full Address                      |
|                                    |
|  [Source] [Date] [Fresh data off]  |
|                                    |
|  4 500 000 USD                     |
|  3 525 USD/sqm                     |
|                                    |
|  +--------------------------------+|
|  | Key facts:                     ||
|  | - Bullet point 1               ||
|  | - Bullet point 2               ||
|  | - Score X/10 (upside, risk)    ||
|  +--------------------------------+|
|                                    |
|  [Schedule a Tour] [Details >]     |
+------------------------------------+
```

### Map View Marker

```text
       +-----+
       | TOP |
       |  1  |
       +-----+
          |
    +-----------+
    | [icon]    |
    | Address   |
    | City      |
    +-----------+
    +---------------+
    | 4 500 000 USD |
    +---------------+
```

### Table View

```text
| # | Name                  | Address              | Price        | Area        | Price/sqft  | Beds  |
|---|----------------------|---------------------|--------------|-------------|-------------|-------|
| 1 | 400 Old Peytonsville | 400 Old Peyton...   | 7 000 000 USD| 324 522 sqft| 22 USD/sqft | Studio|
```

## Data Interface

```typescript
interface UndervaluedProperty {
  id: string;
  rank: number;
  title: string;
  address: string;
  fullAddress: string;
  price: number;
  pricePerSqft: number;
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
```

## Implementation Details

### Header Controls

- **Left**: PDF download button with icon
- **Center**: View mode toggle (Grid/Map/Table) - pill-style buttons with active state
- **Right**: Currency toggle (USD), Unit toggle (m2/sqft), Language toggle (EN)

### Grid View Features

- Image carousel with left/right navigation arrows (or "No photo available" placeholder)
- Property details: area, title with units, full address
- Badges row: Source badge, Date badge, "Fresh data off/on" indicator
- Price display with price per unit
- Key facts section with light blue background containing bullet points
- Action buttons: "Schedule a Tour" (primary blue), "Details >" (outline)

### Map View Features

- Full map background
- Property markers with:
  - Ranking badge ("TOP 1", "2", etc.) - orange for top, gray for others
  - Building icon in circular marker
  - Property name and location below
  - Price badge in orange/blue pill
- Marker popup on hover/click

### Table View Features

- Row numbers
- Sortable columns (indicated by arrows on Price, Area, Price per square)
- Columns: Name, Address, Price, Area, Price per square, Bedrooms
- Clean, minimal styling matching reference

### Styling Notes

- Key facts box: Light blue background (`bg-blue-50` or similar)
- Primary buttons: Solid blue
- Source/Date badges: Rounded pills with subtle styling
- Map markers: Orange/blue color scheme for rankings and prices
- Full-bleed layout (no padding with container)

## ChatWorkspace Integration

Add to existing keyword detection pattern:

```typescript
const UNDERVALUED_KEYWORDS = ["undervalued"];

const [showUndervalued, setShowUndervalued] = useState(
  UNDERVALUED_KEYWORDS.some(kw => lowerPrompt.includes(kw))
);
```

Update `handleChatMessage` to detect "undervalued" keyword and toggle the view, resetting other panel states.

Update `renderRightPanel` to render `UndervaluedProperties` when `showUndervalued` is true.

## Technical Notes

- Component will be full-bleed without padding (container handles border/rounding)
- Uses existing UI primitives: ScrollArea, Button, Badge, Table
- New icons needed: FileDown (PDF), Building2, Camera (no photo placeholder)
- Mock data with 6 sample undervalued properties
- "No photo available" state for properties without images
