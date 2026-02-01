
# Property Valuation Component Implementation

Create a new component for property valuation/estimation that displays detailed analysis including estimated price, rental value, property details, valuation report, income metrics, reviews, and similar properties. The component will be triggered by keywords "valuation", "valuate", "estimation", or "estimate" in the chat.

## Overview

Based on the reference screenshots, the Valuation component will include:

1. **Estimation Section** - Two cards showing Estimated Price (with price per sqft) and Estimated Rent (12 months with ROI), each with action buttons
2. **Property Section** - Address, construction year, floors, area, price, price per sqft with a map preview
3. **About the Property** - Valuation report title and detailed market value analysis
4. **Income-Driven Metrics** - Key operating assumptions, room revenue calculations, cap rates
5. **Social Mentions & Reviews** - Table with source, author, date, sentiment, and quotes
6. **Similar Properties** - Grid of comparable property cards with images, specs, and prices

## Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `src/components/PropertyValuation.tsx` | Create | New valuation component matching reference design |
| `src/pages/ChatWorkspace.tsx` | Modify | Add state and trigger logic for valuation keywords |

## Component Structure

```text
PropertyValuation
+----------------------------------------------------------+
|  Estimation                                               |
|  Description text about market data and features          |
|                                                           |
|  +------------------------+  +-------------------------+  |
|  | Estimated Price        |  | Estimated Rent (12 mo)  |  |
|  | 9,503,759 USD          |  | 360,902 USD             |  |
|  | 1,411 USD/sqft         |  | Rental ROI: 3.9%        |  |
|  | [List for sale btn]    |  | [List for rent btn]     |  |
|  +------------------------+  +-------------------------+  |
|                                                           |
|  Property                                                 |
|  Address line                                             |
|  +-------------------+-------------------+                |
|  | Year of const.    | 1860              |  +----------+  |
|  | Floors count      | 4                 |  |   Map    |  |
|  | Area              | 6735 sqft         |  | Preview  |  |
|  | Price             | 9,223,058 USD     |  +----------+  |
|  | Price per sqft    | 1,369 USD/sqft    |                |
|  +-------------------+-------------------+                |
|                                                           |
|  About the Property                                       |
|  Key details and features                                 |
|                                                           |
|  Hotel - Commercial Valuation Report                      |
|  1. Estimated Current Market Value (Freehold)             |
|  - Low case / Central case / High case                    |
|  - Assumptions list                                       |
|                                                           |
|  3. Income-Driven Metrics and Cap Rates                   |
|  - Key operating assumptions                              |
|  - Room revenue calculations                              |
|  - EBITDA margin and cap rates                            |
|                                                           |
|  Social Mentions & Reviews (Table)                        |
|  | Source | Author | Date | Sentiment | Quote |          |
|                                                           |
|  Similar Properties (Grid)                                |
|  [Card 1] [Card 2] [Card 3]                               |
+----------------------------------------------------------+
```

## Implementation Details

### Mock Data Structure

```typescript
interface ValuationData {
  estimatedPrice: number;
  pricePerSqft: number;
  estimatedRent: number;
  rentalROI: number;
  address: string;
  yearBuilt: number;
  floors: number;
  area: number;
  propertyName: string;
  valuationReport: {
    lowCase: string;
    centralCase: string;
    highCase: string;
    assumptions: string[];
  };
  incomeMetrics: {
    keys: number;
    occupancy: string;
    adr: string;
    revPAR: string;
    roomRevenue: string;
    totalRevenue: string;
    ebitdaMargin: string;
    ebitda: string;
    capRates: { low: string; central: string; high: string };
  };
  reviews: Array<{
    source: string;
    author: string;
    date: string;
    sentiment: string;
    quote: string;
  }>;
  similarProperties: Array<{
    id: string;
    image: string;
    beds: number;
    baths: number;
    sqft: number;
    title: string;
    address: string;
    badge: string;
    date: string;
    price: number;
    pricePerSqft: number;
  }>;
}
```

### Styling Approach

- Use `ScrollArea` for the full-height scrollable content
- Estimation cards with border, padding, and button styling
- Property details as a label-value list alongside a map placeholder
- Valuation report as structured markdown-like sections
- Reviews table using existing Table primitives
- Similar properties grid with image cards

### ChatWorkspace Integration

Add new state variable `showValuation` and update both:
1. Initial prompt detection for "valuation", "valuate", "estimation", "estimate"
2. `handleChatMessage` function to detect these keywords and toggle the view

The component will render in the right panel, replacing the preview (same pattern as PropertyListing).

## Technical Notes

- Component will be full-bleed without padding (container handles border/rounding)
- Uses existing UI primitives: ScrollArea, Button, Badge, Table
- Map placeholder uses the same grid background pattern as PropertyListing's MapView
- Currency formatting follows existing `formatPrice` pattern
- "Get more data" buttons use primary variant, "Details" use outline
