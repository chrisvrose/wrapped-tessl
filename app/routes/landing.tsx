import { useTheme } from "@/components/providers/theme.provider";
import { useSidebar } from "@/components/ui/sidebar";
import type { Route } from "./+types/landing";
import { useEffect, useState } from "react";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Emmanuel Alawode" },
    { name: "description", content: "I build stuff. And they work." },
  ];
}

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
    return `${minutes} minutes`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)} hours`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    return `${days} days ${remainingHours} hours`;
  }
}

export default function Home() {
  const { setTheme, theme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const [mostPlayedGame, setMostPlayedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/profile_76561198095524866.json")
      .then((res) => res.json())
      .then((data: ProfileData) => {
        const games = data.owned_games.games;
        const mostPlayed = games.reduce((max, game) => {
          return game.playtime_forever > max.playtime_forever ? game : max;
        }, games[0]);
        setMostPlayedGame(mostPlayed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid h-full w-full grid-cols-6 grid-rows-5">
      {/* Most Played Section - Warframe Themed */}
      <header className="landing-section col-span-4 row-span-2 flex w-full flex-col justify-center gap-5 border p-4 md:p-8 relative overflow-hidden">
        {mostPlayedGame && (
          <>
            {/* Warframe-themed background gradient */}
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #1e1e2e 0%, #2d1b3d 25%, #4a0e4e 50%, #1e1e2e 75%, #0f0f1e 100%)",
              }}
            />
            {/* Animated energy effect */}
            <div
              className="absolute inset-0 opacity-20 animate-pulse"
              style={{
                background:
                  "radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)",
              }}
            />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div
                  className="h-1 w-16 rounded-full"
                  style={{ background: "linear-gradient(90deg, #00d4ff, #ffd700)" }}
                />
                <span
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "#00d4ff" }}
                >
                  Most Played Game
                </span>
              </div>
              <div>
                <h1
                  className="text-4xl md:text-6xl font-bold mb-2"
                  style={{
                    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #00d4ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {mostPlayedGame.name}
                </h1>
                <p className="text-gray-300 text-lg">
                  Your journey through the Origin System continues
                </p>
              </div>
              <div className="flex gap-8 mt-4">
                <div>
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: "#ffd700" }}
                  >
                    {formatPlaytime(mostPlayedGame.playtime_forever)}
                  </div>
                  <div className="text-sm text-gray-400">Total Playtime</div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: "#00d4ff" }}
                  >
                    {Math.floor(mostPlayedGame.playtime_forever / 60)}h
                  </div>
                  <div className="text-sm text-gray-400">Hours Played</div>
                </div>
              </div>
              {/* Warframe-style decorative elements */}
              <div className="absolute bottom-4 right-4 opacity-10">
                <div
                  className="w-32 h-32 border-2"
                  style={{
                    borderColor: "#00d4ff",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                />
              </div>
            </div>
          </>
        )}
        {loading && (
          <div className="relative z-10 text-gray-400">Loading game data...</div>
        )}
      </header>

      <section className="landing-section col-span-2 row-span-2 border-y p-4 md:p-8"></section>

      <section className="landing-section col-span-6 row-span-1 border p-4 md:p-8"></section>

      <section className="landing-section col-span-6 row-span-2 border" />
    </div>
  );
}
