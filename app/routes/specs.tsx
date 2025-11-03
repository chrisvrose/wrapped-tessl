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
            <CardDescription>Documentation for the Most Played game dashboard section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">
                The dashboard displays the most played game from the Steam profile data with game-themed styling.
                The implementation automatically loads the profile data and determines the game with the highest playtime.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Data Source</h3>
              <p className="text-muted-foreground">
                Profile data is loaded from <code className="bg-muted px-1 py-0.5 rounded">/data/profile_76561198095524866.json</code>
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Fetches game data from the profile JSON file</li>
                <li>Calculates the most played game by total playtime</li>
                <li>Formats playtime for display (days, hours, minutes)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Game Theming</h3>
              <p className="text-muted-foreground">
                The Most Played section is dynamically themed based on the most played game. Currently implemented:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li><strong>Warframe Theme:</strong> Dark purple/blue gradients with cyan and gold accents</li>
                <li>Animated energy effects with pulse animations</li>
                <li>Hexagonal decorative elements</li>
                <li>Gradient text for game titles</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Color Scheme</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="font-medium mb-1">Warframe Theme Colors:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Background: #1e1e2e, #2d1b3d, #4a0e4e</li>
                    <li>Primary Accent: #00d4ff (Cyan)</li>
                    <li>Secondary Accent: #ffd700 (Gold)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">Text Colors:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Title: Gradient (Gold → Cyan)</li>
                    <li>Labels: #00d4ff (Cyan)</li>
                    <li>Stats: #ffd700 (Gold) / #00d4ff (Cyan)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Implementation Details</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-mono text-sm">
                  <strong>File:</strong> app/routes/landing.tsx<br />
                  <strong>Component:</strong> Home<br />
                  <strong>Data Loading:</strong> useEffect hook with fetch API<br />
                  <strong>State Management:</strong> useState for game data and loading state
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Automatic detection of most played game</li>
                <li>Dynamic theming based on game</li>
                <li>Animated background effects</li>
                <li>Playtime formatting (days, hours, minutes)</li>
                <li>Responsive design for mobile and desktop</li>
                <li>Loading state handling</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Future Enhancements</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Support for additional game themes (God of War, etc.)</li>
                <li>Game-specific imagery and backgrounds</li>
                <li>Spendings section implementation</li>
                <li>Hours played section with detailed statistics</li>
                <li>Interactive game selection</li>
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

