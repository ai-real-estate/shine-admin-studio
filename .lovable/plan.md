
# Miami Rent Analytics Component Implementation

Create a new component for rent analytics triggered by "avg rent miami" keyword. This component provides fresh rent analytics for the Miami region with interactive infographics, statistics, and PDF export functionality, inspired by lun.ua's rent analytics report design.

## Overview

The RentAnalytics component provides agents with:
1. Average rent prices by bedroom count (Studio, 1BR, 2BR, 3BR)
2. Year-over-year and period-based trend analysis
3. Interactive line and bar charts showing historical data
4. PDF export functionality for reports
5. Currency toggle (USD)

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/RentAnalytics.tsx` | Create | Main component for rent analytics dashboard |
| `src/pages/ChatWorkspace.tsx` | Modify | Add keyword detection for "avg rent miami" |

## Component Layout

```text
RentAnalytics
+------------------------------------------------------------+
| Header                                                      |
| [TrendingUp] Rent Analytics - Miami    [USD] [Export PDF]  |
+------------------------------------------------------------+
| Summary Cards (1BR, 2BR, 3BR)                               |
| +----------------+ +----------------+ +----------------+    |
| | 1-Bedroom      | | 2-Bedroom      | | 3-Bedroom      |   |
| | $2,850         | | $3,450         | | $4,200         |   |
| | [+3.2%] /year  | | [+5.1%] /year  | | [+4.8%] /year  |   |
| +----------------+ +----------------+ +----------------+    |
+------------------------------------------------------------+
| Price Trend Chart (Line Chart)                              |
| +----------------------------------------------------------+|
| | Title: Average Rent Prices - Miami                       ||
| | Date: February 1, 2026                                   ||
| |                                                          ||
| |  [USD] toggle                                            ||
| |                                                          ||
| |         /\                         __/\                  ||
| |   ___--/  \___                 __/      \___----         ||
| |  /            \___          __/                          ||
| | /                 \________/                             ||
| |                                                          ||
| | Jan 2024 ─────────────────────────────────── Jan 2026    ||
| |                                                          ||
| | Legend: ● 1BR  ● 2BR  ● 3BR                             ||
| +----------------------------------------------------------+|
+------------------------------------------------------------+
| Period Comparison Charts (Grid)                             |
| +--------------------+ +--------------------+               |
| | 1-Bedroom Trends   | | 2-Bedroom Trends   |              |
| |                    | |                    |               |
| | Year | 6mo | 1mo   | | Year | 6mo | 1mo   |              |
| | +3.2%  -1.5%  +2.1% | | +5.1%  +2.3%  +1.8% |             |
| |                    | |                    |               |
| | [Bar][Bar][Bar]    | | [Bar][Bar][Bar]    |              |
| |                    | |                    |               |
| | 2,700 - 2,850      | | 3,200 - 3,450      |              |
| +--------------------+ +--------------------+               |
|                                                             |
| +--------------------+                                      |
| | 3-Bedroom Trends   |                                      |
| |                    |                                      |
| | Year | 6mo | 1mo   |                                      |
| | +4.8%  +1.2%  +3.5% |                                     |
| |                    |                                      |
| | [Bar][Bar][Bar]    |                                      |
| |                    |                                      |
| | 3,950 - 4,200      |                                      |
| +--------------------+                                      |
+------------------------------------------------------------+
| Neighborhood Breakdown Table                                |
| +----------------------------------------------------------+|
| | Neighborhood  | 1BR    | 2BR    | 3BR    | YoY Change   ||
| | Brickell      | $3,200 | $4,100 | $5,500 | +6.2%        ||
| | Downtown      | $2,900 | $3,700 | $4,800 | +4.5%        ||
| | Miami Beach   | $3,500 | $4,500 | $6,200 | +7.1%        ||
| | Coral Gables  | $2,700 | $3,400 | $4,400 | +3.8%        ||
| | Wynwood       | $2,600 | $3,200 | $4,100 | +5.2%        ||
| +----------------------------------------------------------+|
+------------------------------------------------------------+
```

## Data Structures

```typescript
interface RentDataPoint {
  month: string;
  oneBed: number;
  twoBed: number;
  threeBed: number;
}

interface PeriodChange {
  period: "1 Year" | "6 Months" | "1 Month";
  change: number;
  startPrice: number;
  endPrice: number;
}

interface BedroomStats {
  type: "1-Bedroom" | "2-Bedroom" | "3-Bedroom";
  avgRent: number;
  yoyChange: number;
  periods: PeriodChange[];
}

interface NeighborhoodData {
  name: string;
  oneBed: number;
  twoBed: number;
  threeBed: number;
  yoyChange: number;
}
```

## Implementation Details

### Header Section
- Title: "Rent Analytics - Miami" with TrendingUp icon
- Currency badge (USD)
- Export to PDF button with FileDown icon
- Date indicator showing current analysis date

### Summary Cards (Dark Theme)
- 3 cards for 1BR, 2BR, 3BR apartments
- Large price display (e.g., "$2,850")
- Green badge with YoY % change (e.g., "+3.2%")
- Dark background matching lun.ua style: `bg-slate-900`
- Subtle border and rounded corners

### Price Trend Line Chart
- Uses Recharts LineChart component
- Dark themed container matching reference
- 2-year historical data (24 months)
- Three colored lines for each bedroom type:
  - 1BR: Blue (#60A5FA)
  - 2BR: Purple (#A78BFA)
  - 3BR: Cyan (#22D3EE)
- Interactive tooltips showing exact values
- Currency toggle (USD only for Miami)
- X-axis: Months (Jan 2024 - Jan 2026)
- Y-axis: Price in USD

### Period Comparison Cards
- Grid of 3 cards (1BR, 2BR, 3BR)
- Each card shows:
  - Tabs for period selection (1 Year, 6 Months, 1 Month)
  - Percentage change badge (green for positive, red for negative)
  - Bar chart with 3 bars showing historical progression
  - Price range text below
- Dark themed with slate-900 background

### Neighborhood Breakdown Table
- Lists top 5 Miami neighborhoods
- Columns: Neighborhood, 1BR, 2BR, 3BR, YoY Change
- Sortable by any column
- Badge for YoY change (green/red based on value)

### PDF Export Feature
- Trigger via Export PDF button
- Uses browser print functionality with print-specific styles
- Or implement with html2canvas + jsPDF for true PDF
- Includes all charts and data in export

### Mobile Responsiveness
- Summary cards stack vertically on mobile
- Charts resize to fit screen width
- Table becomes horizontally scrollable
- Period comparison cards stack in single column

## ChatWorkspace Integration

Add new keyword detection:

```typescript
const RENT_ANALYTICS_KEYWORDS = ["avg rent", "rent analytics", "rent miami", "average rent"];

const [showRentAnalytics, setShowRentAnalytics] = useState(
  RENT_ANALYTICS_KEYWORDS.some(kw => lowerPrompt.includes(kw))
);
```

Update `handleChatMessage` to detect rent analytics keywords.

Update `renderRightPanel` to render `RentAnalytics` component.

## Mock Data

Generate 24 months of realistic Miami rent data:
- 1BR: Range $2,400-$2,900 with upward trend
- 2BR: Range $3,000-$3,500 with upward trend
- 3BR: Range $3,700-$4,300 with upward trend
- Seasonal variations (summer peaks)

## Technical Notes

- Uses existing chart.tsx with Recharts for visualizations
- Dark theme achieved with Tailwind classes (bg-slate-900, text-white, etc.)
- PDF export uses native browser print or can integrate jsPDF
- All data is mock data for demonstration
- Component follows existing full-bleed pattern (no internal padding)
- Uses ScrollArea for vertical scrolling
- Interactive tooltips on all charts
- Responsive grid layouts for different screen sizes
