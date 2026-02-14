# Implementation Plan - Desktop Layout Overhaul

The user wants a layout that looks like a **Web App**, not a mobile app. The current single-column layout fails to utilize desktop width effectively.

## Proposed Design: Two-Column Dashboard

We will switch from a vertical stack to a grid/flex layout on desktop screens.

### 1. Main Container
- Use `display: grid` with a sidebar ratio (e.g., `350px 1fr`).
- **Left Column**: Upload Panel (Sticky/Fixed).
- **Right Column**: Video Feed.

### 2. Component Refactoring
- **Upload Section**: Move to the left. Make it taller and narrower, suitable for a sidebar.
- **Video Grid**: Expand to fill the rest of the screen. Cards should be responsive (`repeat(auto-fill, minmax(300px, 1fr))`).

### 3. Button Polish
- Stop using `width: 100%` on desktop buttons.
- Use explicit padding and font weights for a "Pro" feel.
- Ensure "Sign Out" is well-placed (maybe in the sidebar or top-right header).

## Files to Modify
- `src/App.css`: Major CSS Grid implementation.
- `src/App.jsx`: wrapper structure changes if necessary (CSS Grid might handle it without DOM changes).
