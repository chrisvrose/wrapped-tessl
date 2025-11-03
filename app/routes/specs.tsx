import type { Route } from "./+types/specs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Spec Files - Wrapped Tessl" },
    { name: "description", content: "Documentation for the Wrapped Tessl dashboard implementation" },
  ];
}

export default function Specs() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Spec Files</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Implementation</CardTitle>
            <CardDescription>Scrollable dashboard displaying top 4 most played games with custom themes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">
                The dashboard is a scrollable page that displays the top 4 most played games from the Steam profile data.
                Each game is displayed in a full-screen section with its own custom thematic styling. Games are automatically
                sorted by total playtime (largest to smallest) and themed based on their identity.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Page Layout</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li><strong>Scrollable Design:</strong> Vertical scrolling through full-screen sections</li>
                <li><strong>Full-Screen Sections:</strong> Each game occupies a minimum full viewport height</li>
                <li><strong>Ordering:</strong> Games ordered by playtime (1st → 4th most played)</li>
                <li><strong>Responsive:</strong> Adapts to mobile, tablet, and desktop viewports</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Data Source</h3>
              <p className="text-muted-foreground">
                Profile data is loaded from <code className="bg-muted px-1 py-0.5 rounded">/data/profile_76561198095524866.json</code>
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Fetches game data from the profile JSON file</li>
                <li>Filters games with playtime greater than 0</li>
                <li>Sorts by <code className="bg-muted px-1 py-0.5 rounded">playtime_forever</code> (descending)</li>
                <li>Selects top 4 games for display</li>
                <li>Formats playtime for display (days, hours, minutes)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Game Themes</h3>
              <p className="text-muted-foreground mb-3">
                Each game section is dynamically themed based on the game's identity. Currently implemented themes:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 pl-4" style={{ borderColor: "#00d4ff" }}>
                  <h4 className="font-semibold mb-2">1. Warframe Theme</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>Background:</strong> Dark purple/blue gradients (#1e1e2e, #2d1b3d, #4a0e4e, #0f0f1e)</li>
                    <li><strong>Primary Accent:</strong> #00d4ff (Cyan)</li>
                    <li><strong>Secondary Accent:</strong> #ffd700 (Gold)</li>
                    <li><strong>Tagline:</strong> "Your journey through the Origin System continues"</li>
                    <li><strong>Decorative:</strong> Hexagonal shape</li>
                  </ul>
                </div>

                <div className="border-l-4 pl-4" style={{ borderColor: "#ffd700" }}>
                  <h4 className="font-semibold mb-2">2. Trove Theme</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>Background:</strong> Purple/blue gradient (#2d1b69, #4a90e2, #7b68ee, #9370db)</li>
                    <li><strong>Primary Accent:</strong> #ffd700 (Gold)</li>
                    <li><strong>Secondary Accent:</strong> #ff69b4 (Pink)</li>
                    <li><strong>Tagline:</strong> "Adventure awaits in the voxel realms"</li>
                    <li><strong>Decorative:</strong> Rotated cube shape</li>
                  </ul>
                </div>

                <div className="border-l-4 pl-4" style={{ borderColor: "#d4af37" }}>
                  <h4 className="font-semibold mb-2">3. Skyrim Theme</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>Background:</strong> Brown/amber Nordic theme (#2c1810, #3d2817, #4a2c1a, #5a3a24)</li>
                    <li><strong>Primary Accent:</strong> #d4af37 (Gold)</li>
                    <li><strong>Secondary Accent:</strong> #8b7355 (Bronze)</li>
                    <li><strong>Tagline:</strong> "The Dragonborn's legacy continues"</li>
                    <li><strong>Decorative:</strong> Dragon-inspired hexagon</li>
                  </ul>
                </div>

                <div className="border-l-4 pl-4" style={{ borderColor: "#e94560" }}>
                  <h4 className="font-semibold mb-2">4. Hollow Knight Theme</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><strong>Background:</strong> Dark blue/black gradient (#0a0a0a, #1a1a2e, #16213e, #0f3460)</li>
                    <li><strong>Primary Accent:</strong> #e94560 (Pink)</li>
                    <li><strong>Secondary Accent:</strong> #00d4ff (Cyan)</li>
                    <li><strong>Tagline:</strong> "Descend into the depths of Hallownest"</li>
                    <li><strong>Decorative:</strong> Circular mask shape</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Implementation Details</h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-mono text-sm">
                  <strong>File:</strong> app/routes/landing.tsx<br />
                  <strong>Main Component:</strong> Home<br />
                  <strong>Section Component:</strong> GameSection<br />
                  <strong>Theme Function:</strong> getGameTheme(gameName: string)<br />
                  <strong>Data Loading:</strong> useEffect hook with fetch API<br />
                  <strong>State Management:</strong> useState for top games array and loading state<br />
                  <strong>Layout:</strong> Scrollable container with overflow-y-auto
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Automatic detection and sorting of top 4 games by playtime</li>
                <li>Dynamic theming system with game-specific themes</li>
                <li>Full-screen sections for immersive experience</li>
                <li>Animated background effects with pulse animations</li>
                <li>Playtime formatting (days, hours, minutes)</li>
                <li>Rank labels (1st, 2nd, 3rd, 4th)</li>
                <li>Game-specific taglines and decorative elements</li>
                <li>Responsive design for all screen sizes</li>
                <li>Loading state handling</li>
                <li>Smooth vertical scrolling</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Component Structure</h3>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`GameSection Component:
  - Full-screen section (min-h-screen)
  - Themed background gradient
  - Animated pulse effects
  - Rank label (1st, 2nd, 3rd, 4th)
  - Game title with gradient text
  - Game-specific tagline
  - Statistics display (Total Playtime, Hours, Rank)
  - Themed decorative element`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Games Chart Page</CardTitle>
            <CardDescription>Visual analytics page for all games' playtime progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">
                The Games Chart page provides a comprehensive visualization of all games in the Steam library.
                It displays playtime data in an interactive pie chart format, showing the top 10 games individually
                with remaining games grouped as "Others", allowing users to see their gaming progress across all titles.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li><strong>Interactive Pie Chart:</strong> Top 10 games displayed individually with remaining games grouped as "Others"</li>
                <li><strong>Statistics Dashboard:</strong> Total games, total playtime, and average playtime</li>
                <li><strong>Top 10 Table:</strong> Quick reference table for most played games</li>
                <li><strong>Custom Tooltips:</strong> Hover over segments to see detailed game information with percentage</li>
                <li><strong>Color-Coded Segments:</strong> Rotating color scheme using CSS chart variables</li>
                <li><strong>Percentage Labels:</strong> Shows percentage for each segment (hides for very small segments)</li>
                <li><strong>Responsive Design:</strong> Adapts to all screen sizes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Implementation Details</h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-mono text-sm">
                  <strong>File:</strong> app/routes/games-chart.tsx<br />
                  <strong>Component:</strong> GamesChart<br />
                  <strong>Chart Library:</strong> Recharts (v2.15.4)<br />
                  <strong>Chart Type:</strong> Pie Chart<br />
                  <strong>Data Loading:</strong> useEffect hook with fetch API<br />
                  <strong>Route:</strong> /games-chart
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Chart Components</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li><strong>PieChart:</strong> Main chart container with responsive design</li>
                <li><strong>Pie:</strong> Pie chart component with outer radius of 180px</li>
                <li><strong>Label:</strong> Shows game name and percentage (hidden for segments &lt; 2%)</li>
                <li><strong>Tooltip:</strong> Custom tooltip showing game name, rank, hours, and percentage of total</li>
                <li><strong>Legend:</strong> Bottom-aligned legend with game names and hours</li>
                <li><strong>Cell:</strong> Individual segments with color coding</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Statistics Cards</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li><strong>Total Games Played:</strong> Count of games with playtime &gt; 0</li>
                <li><strong>Total Playtime:</strong> Sum of all playtime across all games</li>
                <li><strong>Average Playtime:</strong> Average hours per game</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Data Processing</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Filters games with playtime greater than 0</li>
                <li>Sorts games by playtime (descending order)</li>
                <li>Selects top 10 games for individual display</li>
                <li>Groups remaining games into "Others" segment</li>
                <li>Converts minutes to hours for display</li>
                <li>Calculates percentage of total playtime for each segment</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Structure</CardTitle>
            <CardDescription>Profile data format and structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`{
  "owned_games": {
    "games": [
      {
        "appid": 230410,
        "name": "Warframe",
        "playtime_forever": 96973,
        "img_icon_url": "..."
      }
    ]
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

