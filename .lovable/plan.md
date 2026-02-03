

# My Listings Page Implementation

Create a new dedicated page for managing the user's property listings with multiple view modes, status filtering, and editing capabilities.

## Overview

The My Listings page will provide agents with:
1. A centralized view of all their property listings
2. Multiple view modes (Grid, Table) for browsing listings
3. Status filtering (All, Draft, Active, Sold, Archived)
4. Quick actions for editing, publishing, and managing listings
5. Navigation to create new listings
6. Consistent design following existing page patterns

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/MyListings.tsx` | Create | New page for managing listings |
| `src/App.tsx` | Modify | Add route for `/my-listings` |
| `src/components/MiniSidebar.tsx` | Modify | Add new nav item for My Listings |

## Page Layout

```text
MyListings Page
+------------------------------------------------------------+
| [MiniSidebar]  |  Main Content Area                        |
|                |                                            |
| [P] Logo       |  Header                                    |
|                |  +----------------------------------------+|
| [Web]          |  | [Home] My Listings  [+ New Listing]    ||
| [Docs]         |  | 6 listings                             ||
| [API]          |  +----------------------------------------+|
| [Platforms]    |                                            |
| [Listings] <-- |  Filter Tabs                               |
|                |  [All (6)] [Draft (2)] [Active (3)] [Sold] |
|                |                                            |
|                |  View Toggle               Search          |
|                |  [Grid][Table]          [Search...]        |
|                |                                            |
|                |  Listings Content                          |
|                |  +------------------+ +------------------+ |
|                |  | Property Card    | | Property Card    | |
|                |  | [Image]          | | [Image]          | |
|                |  | Title            | | Title            | |
|                |  | $1,250,000       | | $850,000         | |
|                |  | [Draft] [Edit]   | | [Active] [Edit]  | |
|                |  +------------------+ +------------------+ |
|                |                                            |
| [Bell]         |  Table View (alternative)                  |
| [Settings]     |  | Property | Status | Price | Actions |   |
| [Account]      |                                            |
+------------------------------------------------------------+
```

## Data Structure

```typescript
interface MyListing {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "House" | "Condo" | "Townhouse" | "Apartment" | "Commercial";
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: "draft" | "active" | "sold" | "archived";
  platforms: string[];
  views: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
}
```

## Implementation Details

### Sidebar Navigation
- Add new "Listings" nav item with `FileText` icon between "Platforms" and bottom items
- Navigate to `/my-listings` on click

### Header Section
- Breadcrumb-style navigation: Home icon + "My Listings"
- Listing count subtitle
- Primary "New Listing" button (navigates to `/chat?prompt=generate listing`)

### Filter Tabs (Notifications pattern)
- All, Draft, Active, Sold, Archived tabs
- Each tab shows count badge
- Click to filter listings

### View Toggle (PropertyListing pattern)
- Grid and Table view buttons
- Search input for filtering by title/address

### Grid View (PropertyListing/UndervaluedProperties pattern)
- 3-column responsive grid
- Property cards with:
  - Image thumbnail
  - Title and address
  - Price display
  - Status badge (colored by status)
  - Platform badges (MLS, Zillow, etc.)
  - Stats row (views, inquiries)
  - Action buttons (Edit, More options dropdown)

### Table View (PropertyListing pattern)
- Columns: Property (image + title), Address, Status, Price, Platforms, Views, Actions
- Sortable columns
- Row click opens edit dialog or navigates to edit

### Empty State
- Friendly illustration/icon
- "No listings yet" message
- CTA button to create first listing

### Actions
- **Edit**: Navigate to GenerateListing component with pre-filled data
- **Duplicate**: Create a copy of the listing
- **Archive/Unarchive**: Toggle archived status
- **Delete**: Remove listing with confirmation

## Mock Data

```typescript
const mockListings: MyListing[] = [
  {
    id: "1",
    title: "Modern 3-Bedroom Home with Pool",
    address: "123 Sunset Boulevard, Los Angeles, CA 90028",
    price: 1250000,
    type: "House",
    beds: 3,
    baths: 2,
    sqft: 2400,
    image: "https://images.unsplash.com/...",
    status: "active",
    platforms: ["MLS", "Zillow", "Realtor.com"],
    views: 245,
    inquiries: 12,
    createdAt: "2026-01-15",
    updatedAt: "2026-01-28",
  },
  // ... more listings
];
```

## Technical Details

- Uses MiniSidebar and SettingsPanel consistent with other pages
- Light theme with radial gradient background (same as ConnectPlatforms, Notifications)
- Reuses existing UI components: Card, Badge, Button, Table, ScrollArea, DropdownMenu
- Filter tabs follow Notifications page pattern
- View toggle follows PropertyListing pattern
- Responsive design with mobile-first approach
- Status colors: draft (gray), active (green), sold (blue), archived (muted)

