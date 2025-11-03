# Using the Knowledge Index

Required dependencies for this projects are documented in the Knowledge Index: `./KNOWLEDGE.md`

Before starting any work, review the contents of `./KNOWLEDGE.md` to discover the expectations on what dependencies (and which versions) and processes you must follow.

Because the index can link to a large amount of content, use this workflow to read relevant content:

1. Review `./KNOWLEDGE.md` and check if there any relevant files.
2. If so, spawn a research subagent with information about your task and a pointer to the files, and ask it to return a relevant summary of context for you to use (but not to do the task). This will prevent you from getting overwhelmed by too much information.
3. Use the information in your task!

Clarify by interviewing the user if the content is not what you expect:

- There's documentation for a dependency you could use, but it isn't the obvious choice. Check if you are expected to use it for the task you are doing.
- If you are not sure whether to use the version of the dependency from the docs, for example, if you discover that there's a more up to date version of the package.
- If there's documentation that appears to be missing that would help.

REPEAT this workflow for every new task. The Knowledge Index is updated frequently, so make sure to review it for changes.

# Using the Tessl Spec Registry

Documentation can be added to the Knowledge Index using the Tessl `registry` tools:

- Search Tessl's Spec Registry for dependency documentation using `search`
- Install relevant docs into the Knowledge Index using `install`

Consult the Spec Registry when deciding which dependencies to install into a project. Likewise, install the documentation for a given dependency after installing it.

# Dashboard Implementation Specs

## Overview

The dashboard is a scrollable page that displays the top 4 most played games from Steam profile data. Each game is displayed in a full-screen section with custom thematic styling. Games are automatically sorted by total playtime (largest to smallest) and themed based on their identity.

**File**: `app/routes/landing.tsx`

## Page Layout

- **Scrollable Design**: Vertical scrolling through full-screen sections
- **Full-Screen Sections**: Each game occupies a minimum full viewport height (`min-h-screen`)
- **Ordering**: Games automatically sorted by `playtime_forever` (descending order)
- **Responsive**: Adapts to mobile, tablet, and desktop viewports

## Data Loading

- Fetches profile data from `/data/profile_76561198095524866.json`
- Filters games with `playtime_forever > 0`
- Sorts games by total playtime (descending)
- Selects top 4 games using `.slice(0, 4)`
- Uses React hooks (`useState`, `useEffect`) for state management

## Game Theming System

The `getGameTheme(gameName: string)` function dynamically determines the theme based on the game name. Each theme includes:

- Background gradient colors
- Primary and secondary accent colors
- Accent gradient for titles
- Game-specific tagline
- Decorative element type

### Implemented Themes

#### 1. Warframe Theme
- **Background**: Dark purple/blue gradients (#1e1e2e, #2d1b3d, #4a0e4e, #0f0f1e)
- **Primary Accent**: #00d4ff (Cyan)
- **Secondary Accent**: #ffd700 (Gold)
- **Tagline**: "Your journey through the Origin System continues"
- **Decorative**: Hexagonal shape

#### 2. Trove Theme
- **Background**: Purple/blue gradient (#2d1b69, #4a90e2, #7b68ee, #9370db)
- **Primary Accent**: #ffd700 (Gold)
- **Secondary Accent**: #ff69b4 (Pink)
- **Tagline**: "Adventure awaits in the voxel realms"
- **Decorative**: Rotated cube shape

#### 3. Skyrim Theme
- **Background**: Brown/amber Nordic theme (#2c1810, #3d2817, #4a2c1a, #5a3a24)
- **Primary Accent**: #d4af37 (Gold)
- **Secondary Accent**: #8b7355 (Bronze)
- **Tagline**: "The Dragonborn's legacy continues"
- **Decorative**: Dragon-inspired hexagon

#### 4. Hollow Knight Theme
- **Background**: Dark blue/black gradient (#0a0a0a, #1a1a2e, #16213e, #0f3460)
- **Primary Accent**: #e94560 (Pink)
- **Secondary Accent**: #00d4ff (Cyan)
- **Tagline**: "Descend into the depths of Hallownest"
- **Decorative**: Circular mask shape

## Component Structure

### Home Component
- Main component that loads and manages game data
- Renders array of `GameSection` components
- Handles loading and error states

### GameSection Component
- Receives `game` and `rank` props
- Renders full-screen themed section
- Displays:
  - Rank label (1st, 2nd, 3rd, 4th)
  - Game title with gradient text
  - Game-specific tagline
  - Statistics (Total Playtime, Hours Played, Rank)
  - Themed decorative element
  - Animated background effects

## Implementation Details

**Key Features**:
- Automatic detection and sorting of top 4 games
- Dynamic theming system with game-specific themes
- Full-screen sections for immersive experience
- Animated background effects with pulse animations
- Playtime formatting (days, hours, minutes)
- Rank labels and game statistics
- Responsive design
- Loading state handling
- Smooth vertical scrolling

**Data Structure**:
```typescript
interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
}

interface Theme {
  background: string;
  primaryColor: string;
  secondaryColor: string;
  accentGradient: string;
  tagline: string;
  decorative: "hexagon" | "cube" | "dragon" | "mask" | "circle";
}
```

**Layout Configuration**:
- Parent container: `SidebarInset` with `overflow-y-auto` and `h-screen`
- Page container: `w-full` with no overflow restrictions
- Sections: `min-h-screen` for full viewport height

## Future Enhancements
- Support for additional game themes (God of War, etc.)
- Game-specific imagery and backgrounds
- Interactive navigation between sections
- More detailed statistics display
- Animation transitions between sections

For complete documentation, see the [Spec Files page](/specs) in the application.

# Games Chart Page

## Overview

The Games Chart page (`app/routes/games-chart.tsx`) provides a comprehensive visualization of all games in the Steam library with interactive charts and statistics.

**Route**: `/games-chart`

## Features

### Interactive Pie Chart
- Displays top 10 games individually with remaining games grouped as "Others"
- Uses Recharts library for rendering
- Responsive design (600px height)
- Custom tooltips showing game details, hours, and percentage on hover
- Color-coded segments using CSS chart color variables
- Percentage labels on segments (hidden for very small segments &lt; 2%)
- Bottom-aligned legend with game names and hours

### Statistics Dashboard
Three summary cards displaying:
- **Total Games Played**: Count of games with playtime > 0
- **Total Playtime**: Sum of all playtime across all games (in hours)
- **Average Playtime**: Average hours per game

### Top 10 Games Table
- Quick reference table showing:
  - Rank (#1 - #10)
  - Game name
  - Hours played
  - Total playtime (formatted)

## Implementation Details

**File**: `app/routes/games-chart.tsx`

**Key Components**:
- `GamesChart`: Main component managing data and rendering
- `PieChart`: Recharts component for visualization
- `Pie`: Pie chart with configurable radius and labels
- `CustomTooltip`: Custom tooltip component for detailed information with percentage
- Statistics cards using shadcn/ui Card components

**Data Processing**:
- Filters games with `playtime_forever > 0`
- Sorts games by playtime (descending)
- Selects top 10 games for individual display
- Groups remaining games into "Others" segment
- Converts minutes to hours for display
- Calculates percentage of total playtime for each segment

**Chart Configuration**:
- Chart type: Pie Chart
- Outer radius: 180px
- Center: 50% (centered)
- Labels: Shows game name and percentage (hidden for segments &lt; 2%)
- Colors: Rotating through CSS chart color variables (--chart-1 through --chart-5)
- Legend: Bottom-aligned with game names and hours

**Navigation**:
- Added to sidebar under "Analytics" section
- Icon: `IconChartBar` from @tabler/icons-react
- Active state highlighting when on route

## Dependencies

- **Recharts**: v2.15.4 - Charting library for React
- Uses existing shadcn/ui components (Card, etc.)
- Uses existing CSS chart color variables for theming

For complete documentation, see the [Spec Files page](/specs) in the application.