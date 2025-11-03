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

function getGameTheme(gameName: string) {
  const name = gameName.toLowerCase();
  
  if (name.includes("warframe")) {
    return {
      background: "linear-gradient(135deg, #1e1e2e 0%, #2d1b3d 25%, #4a0e4e 50%, #1e1e2e 75%, #0f0f1e 100%)",
      primaryColor: "#00d4ff",
      secondaryColor: "#ffd700",
      accentGradient: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #00d4ff 100%)",
      tagline: "Your journey through the Origin System continues",
      decorative: "hexagon",
    };
  }
  
  if (name.includes("trove")) {
    return {
      background: "linear-gradient(135deg, #2d1b69 0%, #4a90e2 25%, #7b68ee 50%, #9370db 75%, #2d1b69 100%)",
      primaryColor: "#ffd700",
      secondaryColor: "#ff69b4",
      accentGradient: "linear-gradient(135deg, #ffd700 0%, #ff69b4 50%, #7b68ee 100%)",
      tagline: "Adventure awaits in the voxel realms",
      decorative: "cube",
    };
  }
  
  if (name.includes("skyrim") || name.includes("elder scrolls")) {
    return {
      background: "linear-gradient(135deg, #2c1810 0%, #3d2817 25%, #4a2c1a 50%, #5a3a24 75%, #2c1810 100%)",
      primaryColor: "#d4af37",
      secondaryColor: "#8b7355",
      accentGradient: "linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #8b7355 100%)",
      tagline: "The Dragonborn's legacy continues",
      decorative: "dragon",
    };
  }
  
  if (name.includes("hollow knight")) {
    return {
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)",
      primaryColor: "#e94560",
      secondaryColor: "#00d4ff",
      accentGradient: "linear-gradient(135deg, #e94560 0%, #ff6b9d 50%, #00d4ff 100%)",
      tagline: "Descend into the depths of Hallownest",
      decorative: "mask",
    };
  }
  
  // Default theme
  return {
    background: "linear-gradient(135deg, #1e1e2e 0%, #2d1b3d 50%, #1e1e2e 100%)",
    primaryColor: "#00d4ff",
    secondaryColor: "#ffd700",
    accentGradient: "linear-gradient(135deg, #ffd700 0%, #00d4ff 100%)",
    tagline: "Your gaming journey continues",
    decorative: "circle",
  };
}

function GameSection({ game, rank }: { game: Game; rank: number }) {
  const theme = getGameTheme(game.name);
  const rankLabels = ["1st", "2nd", "3rd", "4th"];
  const rankLabel = rankLabels[rank - 1] || `${rank}th`;

  return (
    <section className="min-h-screen w-full flex flex-col justify-center gap-6 p-8 md:p-16 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: theme.background }}
      />
      
      {/* Animated energy effect */}
      <div
        className="absolute inset-0 opacity-20 animate-pulse"
        style={{
          background: `radial-gradient(circle at ${20 + rank * 15}% ${50 + rank * 5}%, rgba(0, 212, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at ${80 - rank * 10}% ${80 - rank * 5}%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col gap-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div
            className="h-1 w-16 rounded-full"
            style={{ background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
          />
          <span
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: theme.primaryColor }}
          >
            {rankLabel} Most Played
          </span>
        </div>
        
        <div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
            style={{
              background: theme.accentGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {game.name}
          </h1>
          <p className="text-gray-200 text-xl md:text-2xl">
            {theme.tagline}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-8 mt-6">
          <div>
            <div
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: theme.secondaryColor }}
            >
              {formatPlaytime(game.playtime_forever)}
            </div>
            <div className="text-sm md:text-base text-gray-300">Total Playtime</div>
          </div>
          <div>
            <div
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: theme.primaryColor }}
            >
              {Math.floor(game.playtime_forever / 60)}h
            </div>
            <div className="text-sm md:text-base text-gray-300">Hours Played</div>
          </div>
          <div>
            <div
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: theme.secondaryColor }}
            >
              #{rank}
            </div>
            <div className="text-sm md:text-base text-gray-300">Rank</div>
          </div>
        </div>
        
        {/* Decorative elements based on game theme */}
        <div className="absolute bottom-8 right-8 opacity-10">
          {theme.decorative === "hexagon" && (
            <div
              className="w-32 h-32 border-2"
              style={{
                borderColor: theme.primaryColor,
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
          )}
          {theme.decorative === "cube" && (
            <div
              className="w-32 h-32 border-2 transform rotate-45"
              style={{
                borderColor: theme.secondaryColor,
              }}
            />
          )}
          {theme.decorative === "dragon" && (
            <div
              className="w-32 h-32 border-2"
              style={{
                borderColor: theme.primaryColor,
                clipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)",
              }}
            />
          )}
          {theme.decorative === "mask" && (
            <div
              className="w-32 h-32 border-2 rounded-full"
              style={{
                borderColor: theme.primaryColor,
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { setTheme, theme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const [topGames, setTopGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/profile_76561198095524866.json")
      .then((res) => res.json())
      .then((data: ProfileData) => {
        const games = data.owned_games.games
          .filter(game => game.playtime_forever > 0)
          .sort((a, b) => b.playtime_forever - a.playtime_forever)
          .slice(0, 4);
        setTopGames(games);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-gray-400 text-xl">Loading game data...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {topGames.map((game, index) => (
        <GameSection key={game.appid} game={game} rank={index + 1} />
      ))}
      {topGames.length === 0 && (
        <div className="h-screen w-full flex items-center justify-center">
          <div className="text-gray-400 text-xl">No game data available</div>
        </div>
      )}
    </div>
  );
}
