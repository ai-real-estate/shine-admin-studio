

# Add Prompt Chat Window to Index Page

This plan adds an AI-style chat prompt interface to the main content area of the Index page, inspired by the reference design.

## Overview

Replace the placeholder text in the main content area with a centered chat prompt component featuring:
- A personalized greeting heading
- A styled input field with placeholder text
- Action buttons (add, attach, theme selector)
- Send controls (plan toggle, voice, send button)

## Components to Create

### 1. PromptChatWindow Component
**File:** `src/components/PromptChatWindow.tsx`

A new component that renders the entire chat prompt interface:

```text
+--------------------------------------------------+
|                                                  |
|        Let's build something, User               |
|                                                  |
|   +------------------------------------------+   |
|   | Ask to create a dashboard to...          |   |
|   +------------------------------------------+   |
|   | + | Attach | Theme v  |   Plan | ))) | -> |  |
|   +------------------------------------------+   |
|                                                  |
+--------------------------------------------------+
```

**Features:**
- Greeting heading with user name (hardcoded initially, can be made dynamic later)
- Textarea/input for prompt entry
- Bottom toolbar with action buttons
- Rounded card styling with subtle shadow

## Implementation Details

### PromptChatWindow Component Structure

**Props:**
- `userName?: string` - Optional user name for greeting (default: "there")
- `onSubmit?: (prompt: string) => void` - Callback when prompt is submitted

**State:**
- `prompt: string` - Current prompt text

**UI Elements:**
1. **Greeting Section**
   - Large heading: "Let's build something, {userName}"
   - Centered, prominent typography

2. **Input Card**
   - Rounded container (rounded-2xl or rounded-3xl)
   - Light background with subtle border
   - Contains textarea and toolbar

3. **Toolbar (Bottom of Input Card)**
   - **Left side buttons:**
     - Plus icon button (ghost variant)
     - Attach button with icon and label
     - Theme dropdown with chevron
   - **Right side buttons:**
     - "Plan" text button
     - Audio/voice icon button
     - Send button (circular, filled with arrow icon)

### Styling Approach
- Use existing UI components: Button, DropdownMenu
- Match the warm, light aesthetic of the current design
- Use icons from lucide-react: Plus, Paperclip, Palette, ChevronDown, ArrowUp, AudioLines

### Index Page Changes
- Replace the placeholder `<p>` tag with `<PromptChatWindow />`
- Keep the existing background gradient styling

## Technical Details

### Icons Needed (from lucide-react)
- `Plus` - Add button
- `Paperclip` - Attach button
- `Palette` - Theme button (or similar)
- `ChevronDown` - Dropdown indicator
- `ArrowUp` - Send button
- `AudioLines` or `Mic` - Voice button

### File Changes Summary

| File | Action |
|------|--------|
| `src/components/PromptChatWindow.tsx` | Create new component |
| `src/pages/Index.tsx` | Import and use PromptChatWindow |

### Component Features (Initial Version)
- Static UI (no AI integration yet)
- Controlled input for prompt text
- Visual-only buttons (handlers can be added later)
- Responsive design that works well in the main content area

