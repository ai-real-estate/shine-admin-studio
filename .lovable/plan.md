

# Generate Listing Component Implementation

Create a new component for property listing generation that allows agents to create and publish property listings across multiple platforms. The component will be triggered by "generate listing" keyword and displayed in the right chat section.

## Overview

The GenerateListing component provides a workflow for agents to:
1. Review/edit auto-generated listing content (from chat input or uploaded photos)
2. Preview the formatted listing with all details
3. Select target platforms and publish the listing

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/GenerateListing.tsx` | Create | Main component for listing generation workflow |
| `src/pages/ChatWorkspace.tsx` | Modify | Add keyword detection and state for "generate listing" |

## Component Structure

```text
GenerateListing
+------------------------------------------------------------+
| Header (matches PropertyListing style)                      |
| [Title: Generate Listing]  [Edit | Preview tabs]  [Status] |
+------------------------------------------------------------+
|                                                             |
| EDIT MODE:                                                  |
| +----------------------------------------------------------+|
| | Photo Gallery                                            ||
| | [+Add] [img1] [img2] [img3] [img4] [img5]                ||
| +----------------------------------------------------------+|
|                                                             |
| +----------------------------------------------------------+|
| | Property Details Form                                    ||
| | Title: [___________________________]                     ||
| | Address: [___________________________]                   ||
| | Price: [________] Type: [Dropdown]                       ||
| | Beds: [__] Baths: [__] Sqft: [______]                    ||
| | Description: [textarea]                                  ||
| | Features: [tag input]                                    ||
| +----------------------------------------------------------+|
|                                                             |
| PREVIEW MODE:                                               |
| +----------------------------------------------------------+|
| | Property Card Preview (styled like listing cards)        ||
| | - Large hero image carousel                              ||
| | - Title, address, price                                  ||
| | - Specs (beds/baths/sqft)                                ||
| | - Full description                                       ||
| | - Feature badges                                         ||
| +----------------------------------------------------------+|
|                                                             |
+------------------------------------------------------------+
| Footer                                                      |
| [Save as Draft]              [List Property ▼]              |
+------------------------------------------------------------+

Platform Selection Dialog (when clicking "List Property"):
+----------------------------------+
| Select Platforms                 |
| +------------------------------+ |
| | [x] MLS                      | |
| | [x] Zillow                   | |
| | [x] Realtor.com              | |
| | [x] Redfin                   | |
| | [ ] Trulia                   | |
| | [ ] Apartments.com           | |
| | [ ] LoopNet                  | |
| | [ ] Craigslist               | |
| +------------------------------+ |
| [Cancel]       [Publish to X]    |
+----------------------------------+
```

## Data Interface

```typescript
interface GeneratedListing {
  id: string;
  title: string;
  address: string;
  price: number;
  type: "House" | "Condo" | "Townhouse" | "Apartment" | "Commercial";
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  features: string[];
  images: string[];
  status: "draft" | "ready" | "published";
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}
```

## Implementation Details

### Header Section
- Title: "Generate Listing" with draft/ready status badge
- Tabs: "Edit" and "Preview" to toggle between modes
- Follows PropertyListing header styling (no PDF button, just tabs centered)

### Edit Mode Features
- **Photo Gallery**: Horizontal scroll of uploaded images with add button
  - Placeholder images from Unsplash for demo
  - "+" button to add more (triggers file upload)
  - Click to set as primary image
- **Property Form**:
  - Title input (pre-filled with AI-generated title if from prompt)
  - Address input with map icon
  - Price input with currency formatting
  - Property type dropdown (House, Condo, etc.)
  - Beds/Baths/Sqft number inputs
  - Description textarea (rich text or plain)
  - Features as tag input (add/remove badges)

### Preview Mode Features
- Full property card preview matching existing listing card design
- Large image carousel at top
- All details formatted exactly as they would appear on platforms
- "Ready to publish" indicator when all required fields are filled

### Platform Selection Dialog
- Triggered by "List Property" button
- Checkbox list of 8+ platforms with icons:
  - MLS, Zillow, Realtor.com, Redfin, Trulia
  - Apartments.com, LoopNet, CoStar, Craigslist
- "Select All" / "Deselect All" quick actions
- Shows count of selected platforms
- "Publish to X platforms" button with confirmation

### Footer Actions
- "Save as Draft" button (outline style)
- "List Property" button (primary style with dropdown arrow)

## ChatWorkspace Integration

Add new keyword detection:

```typescript
const GENERATE_LISTING_KEYWORDS = ["generate listing", "create listing", "new listing"];

const [showGenerateListing, setShowGenerateListing] = useState(
  GENERATE_LISTING_KEYWORDS.some(kw => lowerPrompt.includes(kw))
);
```

Update `handleChatMessage` to detect "generate listing" and toggle the view.

Update `renderRightPanel` to render `GenerateListing` component.

## Technical Notes

- Component is full-bleed (no internal padding, container handles borders)
- Uses existing UI primitives: ScrollArea, Button, Badge, Input, Textarea, Select, Dialog, Checkbox
- Form state managed with useState (no form library needed for this scope)
- Mock data pre-populated for demonstration
- Platform icons from Lucide (Building, Home, Store, etc.)
- Toast notifications for save/publish actions using sonner

## User Flow

1. Agent types "generate listing" or property details in chat
2. Right panel shows GenerateListing component in Edit mode
3. Agent reviews/edits auto-populated fields (from prompt parsing)
4. Agent uploads additional photos via gallery
5. Agent switches to Preview to see formatted listing
6. Agent clicks "List Property" to open platform dialog
7. Agent selects target platforms
8. Agent clicks "Publish" to complete the flow
9. Success toast shows with platform count

