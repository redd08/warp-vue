# Smart Football Draw

A modern football tournament draw application built with Vue 3, TypeScript, Tailwind CSS, and Pinia, organized using Feature-Sliced Design (FSD) architecture.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - Vue store library for state management
- **Vite** - Fast build tool and dev server

## Project Setup

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Features

- ⚽ Add and manage football teams
- 🎲 Random draw generation for matches
- 🏆 Support for multiple teams and countries
- 📱 Responsive design with Tailwind CSS
- 🔄 Reset and redraw functionality
- 🏗️ **Feature-Sliced Design architecture**
- ✅ Vue 3 Composition API
- ✅ TypeScript support
- ✅ Pinia for state management
- ✅ Hot Module Replacement (HMR)

## Project Structure (Feature-Sliced Design)

```
src/
├── app/                    # App layer - application initialization
│   └── providers.ts        # Global providers setup
├── pages/                  # Pages layer - application pages
│   └── draw-page/         # Draw page
│       ├── ui/
│       └── index.ts
├── widgets/               # Widgets layer - composite UI components
│   ├── team-list/         # Team list widget
│   └── match-results/     # Match results widget
├── features/              # Features layer - business features
│   ├── team-management/   # Team management feature
│   └── draw-generation/   # Draw generation feature
├── entities/              # Entities layer - business entities
│   ├── team/             # Team entity
│   │   ├── model/        # Team business logic
│   │   ├── ui/           # Team UI components
│   │   └── index.ts
│   └── match/            # Match entity
├── shared/               # Shared layer - reusable resources
│   ├── ui/              # Shared UI components
│   ├── lib/             # Utility functions
│   └── config/          # Configuration
├── App.vue              # Root component
├── main.ts              # Application entry point
└── style.css            # Global styles
```

## Architecture: Feature-Sliced Design

This project follows **Feature-Sliced Design (FSD)** methodology, which organizes code by:

### Layers (from top to bottom):
- **app** - Application initialization and global providers
- **pages** - Application pages and routing
- **widgets** - Composite UI components that combine features
- **features** - Business features and use cases
- **entities** - Business entities with their own logic and UI
- **shared** - Reusable code, utilities, and UI components

### Benefits:
- 🎯 **Clear separation of concerns**
- 🔧 **High maintainability**
- 📦 **Reusable components**
- 🧪 **Easy testing**
- 👥 **Team-friendly structure**

## State Management

State is distributed across layers using Pinia:
- **Team Store** (`entities/team`) - Team data management
- **Match Store** (`entities/match`) - Match data management  
- **Draw Store** (`features/draw-generation`) - Draw logic and state

## Styling

Tailwind CSS is configured and ready to use. The configuration includes:

- Content paths for Vue files
- PostCSS integration
- Autoprefixer for vendor prefixes

## Development

The project is set up with:

- TypeScript strict mode
- Vue 3 Composition API
- Tailwind CSS utilities
- Pinia stores with TypeScript
- Hot Module Replacement for fast development

Start the development server with `npm run dev` and visit `http://localhost:5173` to manage teams and generate football draws!

## How to Use

1. **Add Teams**: Click "Add Team" to add football teams with their countries
2. **Manage Teams**: View all teams and remove any if needed
3. **Generate Draw**: Click "Start Draw" to randomly pair teams for matches
4. **View Results**: See the generated match fixtures with team flags
5. **Reset**: Click "Reset" to clear the draw and start over

The app comes with 8 pre-loaded European football teams to get you started!
GitHub Actions Test - Sun Aug  3 20:26:10 MSK 2025
