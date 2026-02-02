# AI Dev Team - Mission Control UI

A sleek, modern dark-mode dashboard for visualizing the AI Scrum team in action.

## Tech Stack
- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** for glassmorphism styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Lucide React** for icons

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Context7 MCP (use context7)

When developing UI components, use Context7 MCP to fetch up-to-date documentation for:
- **React**: Hooks, component patterns, concurrent features
- **Framer Motion**: Animation variants, gestures, layout animations
- **Tailwind CSS**: Utility classes, custom configurations
- **Zustand**: Store patterns, middleware, selectors

## Components

| Component | Purpose |
|-----------|---------|
| `AgentOrb` | Animated status indicator for each agent |
| `WarRoom` | Container for agent visualization |
| `ArtifactCard` | Display card for generated outputs |
| `ArtifactGallery` | Grid layout for all artifacts |
| `SystemPulse` | Real-time log terminal |

## State Management

The `sprintStore.ts` uses Zustand to manage:
- Sprint goal and running status
- Agent statuses and thoughts
- Generated artifacts
- System logs
