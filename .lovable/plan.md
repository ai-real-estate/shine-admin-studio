

# Property Detail Dialog Implementation

Add a dialog window that displays detailed property information when clicking on any property card, marker, or table row. The dialog design is inspired by the Zillow-style reference showing a photo gallery, property details, and action buttons.

## Overview

When a user clicks on a property in any view (Grid, Map, or Table), a dialog opens showing:
- Photo gallery with main image and thumbnails
- Property title with verification badge
- Address
- Feature tags (property type, beds, pet-friendly, amenities)
- Action buttons (Schedule Tour, Apply Now)
- Property specifications (beds, baths, sqft)

## Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `src/components/PropertyDetailDialog.tsx` | Create | New dialog component for property details |
| `src/components/PropertyListing.tsx` | Modify | Add click handlers and dialog state |

## Component Design

### PropertyDetailDialog Component

```text
+--------------------------------------------------+
|  [X]                                              |
|  +------------------+  +-------+  +-------+       |
|  |                  |  |  img  |  |  img  |       |
|  |   Main Image     |  +-------+  +-------+       |
|  |                  |  +-------+  +-------+       |
|  |                  |  |  img  |  | See   |       |
|  +------------------+  +-------+  | all   |       |
|                                                   |
|  Property Title  ✓                                |
|  123 Address Street, City, ST 12345               |
|                                                   |
|  +--------+ +----------+ +---------+ +--------+   |
|  | Type   | | Beds     | | Feature | | Feature|   |
|  +--------+ +----------+ +---------+ +--------+   |
|                                                   |
|  +-------------------+  +--------------------+    |
|  |   Schedule Tour   |  |    Apply Now       |    |
|  +-------------------+  +--------------------+    |
+--------------------------------------------------+
```

**Props:**
- `property: Property | null` - The property to display (null when closed)
- `open: boolean` - Whether dialog is open
- `onOpenChange: (open: boolean) => void` - Callback for open state changes

**Features:**
- Photo gallery: Main large image + 4 thumbnail grid
- "See all photos" button overlay on last thumbnail
- Property title with green check badge
- Address display
- Feature tags using Badge components
- Two action buttons: Schedule Tour (primary), Apply Now (outline)
- Detailed specs section with icons

### Property Interface Updates

Add additional fields to the Property interface for the detail view:
- `images: string[]` - Array of additional property images
- `features: string[]` - Array of feature tags
- `petFriendly: boolean`
- `verified: boolean`

## Implementation Details

### Dialog Sizing
- Use a wider dialog: `max-w-4xl` to accommodate the photo gallery
- Add `overflow-hidden` for proper image clipping
- Use `ScrollArea` for content if needed

### Photo Gallery Layout
- CSS Grid: Main image takes left 60%, thumbnail grid takes right 40%
- 2x2 thumbnail grid
- Last thumbnail has "See all X photos" overlay

### Feature Tags
Each feature displayed as a pill/badge with icon:
- Building icon + property type
- Bed icon + bed count
- Paw icon + "Pet-friendly" (if applicable)
- Additional amenity tags

### Click Handler Integration
Update all three views to trigger the dialog:
- **GridView**: Add onClick to the property card div
- **MapView**: Add onClick to the marker div
- **TableView**: Add onClick to the TableRow

### State Management
Add to PropertyListing component:
- `selectedProperty: Property | null` - Currently selected property
- `dialogOpen: boolean` - Dialog visibility state

## Technical Details

### Icons Needed (from lucide-react)
- `CheckCircle2` or `BadgeCheck` - Verification badge
- `Building2` - Property type
- `PawPrint` - Pet-friendly
- `Wifi` - Amenities (example)
- `Car` - Parking (example)
- `WashingMachine` - Laundry (example)
- `Heart` - Save/favorite button
- `Share2` - Share button
- `MoreHorizontal` - More options

### Mock Data Enhancement
Add gallery images and features to each mock property for a richer detail view.

