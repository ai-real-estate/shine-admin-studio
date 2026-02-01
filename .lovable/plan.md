

# Connect Platforms Page Implementation

Create a new dedicated page for managing platform integrations where agents can connect, configure, and monitor their listing platform accounts. This page will be accessible from the side menu.

## Overview

The Connect Platforms page allows agents to:
1. View all available listing platforms with connection status
2. Connect/disconnect platform accounts via OAuth or API key
3. Monitor sync status and manage platform settings
4. See connected platforms at a glance

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/ConnectPlatforms.tsx` | Create | Main page for platform integrations |
| `src/components/MiniSidebar.tsx` | Modify | Add "Platforms" nav item |
| `src/pages/Index.tsx` | Modify | Add navigation handler for platforms |
| `src/pages/ChatWorkspace.tsx` | Modify | Add navigation handler for platforms |
| `src/App.tsx` | Modify | Add route for /platforms |

## Platform List

The page will include the following platforms as requested:
- MLS
- Zillow
- Realtor.com
- Redfin
- Bayut (UAE)
- PropertyFinder (Middle East)
- Idealista (Spain/Europe)
- Lun (Ukraine)

## Component Structure

```text
ConnectPlatforms Page
+------------------------------------------------------------+
| Header                                                      |
| [Share2 Icon] Connect Platforms     [Search] [Filter ▼]    |
+------------------------------------------------------------+
|                                                             |
| Connected (X)                                               |
| +----------------------------------------------------------+|
| | [MLS Logo]  MLS                      [Connected] [•••]  ||
| | Last synced: 2 min ago                                  ||
| +----------------------------------------------------------+|
| | [Zillow Logo]  Zillow                [Connected] [•••]  ||
| | Last synced: 5 min ago                                  ||
| +----------------------------------------------------------+|
|                                                             |
| Available (X)                                               |
| +----------------------------------------------------------+|
| | [Realtor Logo]  Realtor.com          [Connect]          ||
| | List properties on America's #1 site                    ||
| +----------------------------------------------------------+|
| | [Redfin Logo]  Redfin                [Connect]          ||
| | Reach tech-savvy home buyers                            ||
| +----------------------------------------------------------+|
| | [Bayut Logo]  Bayut                  [Connect]          ||
| | UAE's leading property portal                           ||
| +----------------------------------------------------------+|
| | [PropertyFinder Logo]  PropertyFinder [Connect]         ||
| | Middle East's property marketplace                      ||
| +----------------------------------------------------------+|
| | [Idealista Logo]  Idealista          [Connect]          ||
| | Spain & Portugal's real estate leader                   ||
| +----------------------------------------------------------+|
| | [Lun Logo]  Lun                      [Connect]          ||
| | Ukraine's property platform                             ||
| +----------------------------------------------------------+|
|                                                             |
+------------------------------------------------------------+
```

## Data Interface

```typescript
interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
  region?: string;
}
```

## Implementation Details

### Page Layout
- Full-page layout matching Notifications page style
- MiniSidebar on left, main content area with rounded border
- Radial gradient background matching existing pages

### Header Section
- Title "Connect Platforms" with Share2 icon
- Search input to filter platforms by name
- Filter dropdown for region (All, North America, Europe, Middle East, etc.)

### Platform Cards
- Two sections: "Connected" and "Available"
- Each card shows:
  - Platform icon (using Lucide icons or custom SVGs)
  - Platform name and description
  - Connection status badge
  - Action button (Connect/Manage)
  - For connected: last sync time and dropdown menu (Sync Now, Settings, Disconnect)

### Connect Dialog
- Modal dialog triggered by "Connect" button
- Shows platform-specific connection options:
  - OAuth flow button ("Sign in with [Platform]")
  - Or API key input for platforms that use keys
- Connection instructions and help link

### Platform Actions Menu (for connected)
- "Sync Now" - trigger manual sync
- "Settings" - open platform-specific settings
- "Disconnect" - disconnect with confirmation

## Sidebar Integration

Add new navigation item to MiniSidebar:

```typescript
const navItems = [
  { id: "api", icon: Zap, label: "API" },
  { id: "documents", icon: FileText, label: "Documents" },
  { id: "web", icon: Globe, label: "Web" },
  { id: "sources", icon: GitBranch, label: "Sources" },
  { id: "code", icon: Code, label: "Code" },
  { id: "platforms", icon: Share2, label: "Platforms" },  // NEW
];
```

## Technical Notes

- Uses existing UI components: Card, Button, Badge, Dialog, Input, DropdownMenu
- Platform state managed with useState (mock data for demo)
- Toast notifications for connect/disconnect/sync actions
- Mobile-responsive design with stacked cards on small screens
- Search and filter functionality built-in

## User Flow

1. Agent clicks "Platforms" in sidebar
2. Navigates to /platforms page
3. Views list of all platforms grouped by connection status
4. Clicks "Connect" on available platform
5. Completes OAuth or API key entry in dialog
6. Platform moves to "Connected" section
7. Can manage connected platforms via dropdown menu

