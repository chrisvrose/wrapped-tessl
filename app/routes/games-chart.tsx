import type { Route } from "./+types/games-chart";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
}

interface ProfileData {
  owned_games: {
    games: Game[];
  };
}

function formatPlaytime(minutes: number): string {
  const hours = minutes / 60;
  if (hours < 1) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    return `${days}d ${remainingHours}h`;
  }
}

function formatHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10;
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Games Chart - Wrapped Tessl" },
    { name: "description", content: "Visualization of all games' playtime progress" },
  ];
}

export default function GamesChart() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalGames, setTotalGames] = useState(0);
  const [totalPlaytime, setTotalPlaytime] = useState(0);

  useEffect(() => {
    fetch("/data/profile_76561198095524866.json")
      .then((res) => res.json())
      .then((data: ProfileData) => {
        const allGames = data.owned_games.games
          .filter((game) => game.playtime_forever > 0)
          .sort((a, b) => b.playtime_forever - a.playtime_forever);
        
        setGames(allGames);
        setTotalGames(allGames.length);
        setTotalPlaytime(allGames.reduce((sum, game) => sum + game.playtime_forever, 0));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile data:", err);
        setLoading(false);
      });
  }, []);

  // Show top 10 games individually, group the rest as "Others"
  const topGames = games.slice(0, 10);
  const otherGames = games.slice(10);
  const otherGamesTotal = otherGames.reduce((sum, game) => sum + game.playtime_forever, 0);

  const chartData = [
    ...topGames.map((game, index) => ({
      name: game.name,
      fullName: game.name,
      value: formatHours(game.playtime_forever),
      minutes: game.playtime_forever,
      rank: index + 1,
    })),
    ...(otherGamesTotal > 0 ? [{
      name: `Others (${otherGames.length} games)`,
      fullName: `Other ${otherGames.length} games`,
      value: formatHours(otherGamesTotal),
      minutes: otherGamesTotal,
      rank: 11,
    }] : []),
  ];

  const getPieColor = (index: number) => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];
    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.payload.fullName}</p>
          {data.payload.rank <= 10 && (
            <p className="text-sm text-muted-foreground">
              Rank: #{data.payload.rank}
            </p>
          )}
          <p className="text-sm">
            <span className="font-medium">{data.value}h</span> ({formatPlaytime(data.payload.minutes)})
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {((data.value / formatHours(totalPlaytime)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground text-xl">Loading game data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Games Progress Chart</h1>
        <p className="text-muted-foreground">
          Visual representation of all games' playtime across your Steam library
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Games Played</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalGames}</div>
            <p className="text-sm text-muted-foreground mt-1">games with playtime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Playtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatHours(totalPlaytime).toLocaleString()}h
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {formatPlaytime(totalPlaytime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Playtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalGames > 0 ? formatHours(totalPlaytime / totalGames).toFixed(1) : 0}h
            </div>
            <p className="text-sm text-muted-foreground mt-1">per game</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Playtime Distribution</CardTitle>
          <CardDescription>
            Top 10 games with remaining games grouped as "Others". Hover over segments for details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    if (percent < 0.02) return ""; // Hide labels for very small segments
                    return `${name}: ${(percent * 100).toFixed(1)}%`;
                  }}
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getPieColor(index)} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => {
                    const data = chartData.find((d) => d.name === value);
                    return data ? `${value} (${data.value}h)` : value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Games Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Most Played Games</CardTitle>
          <CardDescription>Quick reference for your most played games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Rank</th>
                  <th className="text-left p-2 font-semibold">Game</th>
                  <th className="text-right p-2 font-semibold">Hours</th>
                  <th className="text-right p-2 font-semibold">Total Playtime</th>
                </tr>
              </thead>
              <tbody>
                {games.slice(0, 10).map((game, index) => (
                  <tr key={game.appid} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <span className="font-medium text-muted-foreground">#{index + 1}</span>
                    </td>
                    <td className="p-2 font-medium">{game.name}</td>
                    <td className="p-2 text-right">{formatHours(game.playtime_forever)}h</td>
                    <td className="p-2 text-right text-muted-foreground text-sm">
                      {formatPlaytime(game.playtime_forever)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

