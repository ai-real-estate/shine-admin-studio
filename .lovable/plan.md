

# Find Agent Feature Implementation

Add a new "Find agent" hint chip to the Index page with animated location cycling (Los Angeles, Austin, Chicago), and create an Agent Grid component with clickable agent cards that open a detailed dialog with agent information, services, and listings.

## Overview

This feature will provide users with:
1. New "Find agent" hint chip with typewriter animation cycling through cities
2. Agent Grid component displayed in the ChatWorkspace right panel when searching for agents
3. Agent cards with full-card city background image, avatar, name, and company
4. Agent Detail Dialog with comprehensive agent information, services, and property listings
5. Reuse existing patterns from PropertyListing, PropertyDetailDialog, and UndervaluedProperties

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/PromptChatWindow.tsx` | Modify | Add "Find agent" hint chip with location animation |
| `src/components/AgentGrid.tsx` | Create | Agent grid/table view component |
| `src/components/AgentDetailDialog.tsx` | Create | Agent detail popup dialog |
| `src/pages/ChatWorkspace.tsx` | Modify | Add keyword detection for "find agent" |

## Agent Card Design (Based on Reference Image)

```text
+----------------------------------------+
|                                        |
|    [Full-width city/office image]      |
|                                        |
|  Agent Name          [BADGE: Level]    |
|  TITLE / ROLE                          |
|                                        |
|  [Avatar]              [More info] [+] |
|                                        |
+----------------------------------------+
```

The card will feature:
- Full-card background image (city skyline or company office)
- Agent name prominently displayed
- Badge indicating specialization level (Residential, Commercial, etc.)
- Title/role subtitle
- Circular avatar positioned in bottom-left
- "More info" button in bottom-right

## Data Structure

```typescript
interface Agent {
  id: string;
  name: string;
  title: string;
  company: string;
  companyLogo?: string;
  avatar: string;
  cityImage: string;
  city: string;
  badge: "Residential" | "Commercial" | "Luxury" | "Investment";
  rating: number;
  reviews: number;
  experience: string;
  phone: string;
  email: string;
  bio: string;
  specializations: string[];
  services: string[];
  listings: PropertyListing[];
  coordinates: { x: number; y: number };
}
```

## Mock Data

```typescript
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    title: "Senior Real Estate Agent",
    company: "Coldwell Banker",
    avatar: "https://images.unsplash.com/photo-...",
    cityImage: "https://images.unsplash.com/photo-losangeles...",
    city: "Los Angeles",
    badge: "Luxury",
    rating: 4.9,
    reviews: 127,
    experience: "12 years",
    phone: "(310) 555-0123",
    email: "sarah.mitchell@coldwellbanker.com",
    bio: "Specializing in luxury properties...",
    specializations: ["Luxury Homes", "Beachfront Properties"],
    services: ["Buyer Representation", "Seller Representation", "Market Analysis"],
    listings: [...],
    coordinates: { x: 25, y: 40 },
  },
  // ... more agents for Austin, Chicago, etc.
];
```

## Implementation Details

### 1. PromptChatWindow.tsx - Add Find Agent Hint

Add new hint chip to HINT_CHIPS array:

```typescript
const HINT_CHIPS: HintChip[] = [
  // ... existing chips
  { 
    label: "Find agent", 
    basePrompt: "Find agent in ",
    locations: ["Los Angeles", "Austin", "Chicago"]
  },
];
```

### 2. AgentGrid.tsx - Main Component

Header with view toggle (Grid/Map/Table):
```tsx
<div className="flex items-center justify-between border-b border-border px-6 py-4">
  <div>
    <h1 className="text-md font-semibold">Real Estate Agents</h1>
    <p className="text-sm text-muted-foreground">12 agents found</p>
  </div>
  <div className="flex items-center rounded-lg border bg-card p-1 gap-1">
    <Button onClick={() => setViewMode("grid")}>Grid</Button>
    <Button onClick={() => setViewMode("map")}>Map</Button>
    <Button onClick={() => setViewMode("table")}>Table</Button>
  </div>
</div>
```

Agent Card (matching reference image style):
```tsx
<div className="relative overflow-hidden rounded-xl border border-border/50 bg-card">
  {/* Full-card background image */}
  <div className="relative aspect-[4/3]">
    <img src={agent.cityImage} className="w-full h-full object-cover" />
    
    {/* Gradient overlay for text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    
    {/* Content overlay */}
    <div className="absolute inset-0 p-4 flex flex-col justify-between">
      {/* Top section - Name and Badge */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{agent.name}</h3>
          <p className="text-sm text-white/80 uppercase tracking-wide">{agent.title}</p>
        </div>
        <Badge className="bg-card/90 text-foreground">{agent.badge}</Badge>
      </div>
      
      {/* Bottom section - Avatar and Actions */}
      <div className="flex justify-between items-end">
        <Avatar className="h-14 w-14 border-2 border-white">
          <AvatarImage src={agent.avatar} />
          <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" className="rounded-full">
            More info
          </Button>
          <Button size="icon-sm" variant="secondary" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 3. AgentDetailDialog.tsx - Detail Popup

Dialog structure (similar to PropertyDetailDialog):
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
    <ScrollArea className="max-h-[90vh]">
      {/* Header with city image */}
      <div className="relative h-48">
        <img src={agent.cityImage} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-6 flex items-end gap-4">
          <Avatar className="h-20 w-20 border-4 border-white">...</Avatar>
          <div className="text-white">
            <h2 className="text-2xl font-bold">{agent.name}</h2>
            <p className="text-white/80">{agent.title} at {agent.company}</p>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="flex gap-6">
          <Stat label="Rating" value={agent.rating} icon={Star} />
          <Stat label="Reviews" value={agent.reviews} />
          <Stat label="Experience" value={agent.experience} />
        </div>

        {/* Bio */}
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-muted-foreground">{agent.bio}</p>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold mb-2">Services</h3>
          <div className="flex flex-wrap gap-2">
            {agent.services.map(service => (
              <Badge variant="secondary">{service}</Badge>
            ))}
          </div>
        </div>

        {/* Listings */}
        <div>
          <h3 className="font-semibold mb-2">Current Listings</h3>
          <div className="grid grid-cols-2 gap-4">
            {agent.listings.map(listing => (
              <PropertyCard property={listing} />
            ))}
          </div>
        </div>

        {/* Contact buttons */}
        <div className="flex gap-3">
          <Button className="flex-1">Contact Agent</Button>
          <Button variant="outline" className="flex-1">Schedule Call</Button>
        </div>
      </div>
    </ScrollArea>
  </DialogContent>
</Dialog>
```

### 4. ChatWorkspace.tsx - Integration

Add keyword detection:
```typescript
const AGENT_KEYWORDS = ["find agent", "find agents", "real estate agent"];

const [showAgentGrid, setShowAgentGrid] = useState(
  AGENT_KEYWORDS.some(kw => lowerPrompt.includes(kw))
);
```

Update handleChatMessage and renderRightPanel:
```typescript
if (AGENT_KEYWORDS.some(kw => lowerMessage.includes(kw))) {
  setShowAgentGrid(true);
  // Reset other panels...
}

// In renderRightPanel:
if (showAgentGrid) {
  return (
    <div className="h-full rounded-2xl border border-border/50 overflow-hidden">
      <AgentGrid />
    </div>
  );
}
```

## Reused Components and Patterns

| From Component | Reused Pattern |
|----------------|----------------|
| PropertyListing | Header with view toggle (Grid/Map/Table), grid card layout |
| PropertyDetailDialog | Dialog structure, ScrollArea, image gallery header |
| UndervaluedProperties | Map view with coordinate markers, card styling |
| PromptChatWindow | Hint chip animation (typeText, untypeText, animateLocations) |

## Technical Notes

- Uses existing Avatar, Badge, Button, Dialog, ScrollArea components
- Light theme consistent with other components (bg-background, bg-card)
- Agent cards feature gradient overlays for text legibility over images
- Map view shows agents with location markers using existing coordinate pattern
- Table view includes sortable columns for name, company, city, rating
- City images use Unsplash for LA, Austin, Chicago skylines

