

# Chat Workspace Page Implementation

When a user enters a prompt and presses Enter, they'll navigate to a new workspace page with a two-panel layout: a chat panel on the left and an animated demo/preview panel on the right.

## Overview

```text
+--------+---------------------------+---------------------------+
|        |       CHAT PANEL          |      PREVIEW PANEL        |
|  Mini  | +----------------------+  | +----------------------+  |
| Sidebar| | Chat messages        |  | |                      |  |
|  (64px)| |                      |  | |   Animated Demo      |  |
|        | |                      |  | |   Preview Area       |  |
|        | |                      |  | |                      |  |
|        | +----------------------+  | +----------------------+  |
|        | | Prompt input bar     |  |                           |
|        | +----------------------+  |                           |
+--------+---------------------------+---------------------------+
```

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/ChatWorkspace.tsx` | Create | New workspace page with two-panel layout |
| `src/components/ChatPanel.tsx` | Create | Left panel with chat messages and input |
| `src/components/PreviewPanel.tsx` | Create | Right panel with animated demo content |
| `src/pages/Index.tsx` | Modify | Add navigation logic to ChatWorkspace on submit |
| `src/App.tsx` | Modify | Register the new `/chat` route |

## Component Details

### 1. ChatPanel Component
A chat interface showing conversation history with the AI:

**Features:**
- Message list displaying user prompts and AI responses
- Scrollable message area
- Bottom-fixed prompt input bar (reusing elements from PromptChatWindow)
- Message bubbles with different styles for user vs AI

**Initial State:**
- Shows the initial user prompt passed from the Index page
- Placeholder AI response (e.g., "I'm working on that...")

### 2. PreviewPanel Component
An animated demo area on the right side:

**Features:**
- Placeholder content with animated elements
- Could show: code preview, app mockup, or loading animations
- Subtle animations: fade-in elements, pulsing dots, skeleton loaders

**Animated Demo Ideas:**
- Typing animation showing "Building your app..."
- Animated skeleton UI components
- Floating geometric shapes with subtle movement
- Code block with syntax highlighting that "types" out

### 3. ChatWorkspace Page
The main workspace page combining both panels:

**Layout:**
- Uses the same MiniSidebar from Index page (maintains navigation consistency)
- Two-panel resizable layout using `react-resizable-panels` (already installed)
- Left panel: ~40% width for ChatPanel
- Right panel: ~60% width for PreviewPanel
- Both panels have the same rounded container styling as Index page

### 4. Index Page Changes
- Modify the `onSubmit` callback in PromptChatWindow
- Navigate to `/chat` route with the prompt as state/param

## Technical Implementation

### Navigation Flow
1. User types prompt on Index page
2. Presses Enter or clicks Send button
3. Navigate to `/chat?prompt={encodedPrompt}` or use React Router state
4. ChatWorkspace reads the initial prompt and displays it

### Animations for Preview Panel
Using existing Tailwind animations from the config:
- `animate-fade-in` for initial content
- `animate-slide-in-right` for elements appearing
- Custom pulse/typing animations for the "building" effect

### Message Data Structure
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

## Visual Design

**Chat Panel:**
- Clean white/card background
- Message bubbles: user messages aligned right (accent color), AI messages aligned left (muted)
- Prompt bar at bottom with same styling as PromptChatWindow

**Preview Panel:**
- Gradient background matching the Index page style
- Centered animated content
- Professional "under construction" or preview feeling

---

## Technical Details

### Route Setup
```typescript
// App.tsx - Add new route
<Route path="/chat" element={<ChatWorkspace />} />
```

### Resizable Panels Usage
The project already has `react-resizable-panels` installed. Will use:
- `ResizablePanelGroup` with horizontal direction
- `ResizablePanel` for each side
- `ResizableHandle` for drag-to-resize functionality

### State Management
- Initial prompt passed via URL search params or router state
- Local state for chat messages in ChatWorkspace
- Messages array will be updatable for future AI integration

