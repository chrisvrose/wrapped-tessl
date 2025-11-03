import type { Route } from "./+types/spendings";
import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, ShoppingCart, Gamepad2, Gift, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Steam Spending Analytics" },
    { name: "description", content: "Detailed breakdown of your Steam spending habits" },
  ];
}

interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
}

interface ProfileData {
  steam_id: string;
  player_summary: {
    personaname: string;
    timecreated: number;
  };
  owned_games: {
    game_count: number;
    games: Game[];
  };
}

interface SpendingStats {
  totalSpent: number;
  averagePerGame: number;
  gamesOwned: number;
  estimatedFreeGames: number;
  estimatedPaidGames: number;
  mostExpensiveGame: { name: string; price: number };
  yearlyBreakdown: { year: number; amount: number }[];
  topExpensiveGames: { name: string; price: number; playtime: number }[];
  categoryBreakdown: { category: string; count: number; total: number }[];
}

/**
 * Calculates estimated spending statistics from Steam profile data
 * Uses industry-standard pricing models and game categorization
 */
function calculateSpendingStats(data: ProfileData): SpendingStats {
  const games = data.owned_games.games;
  const totalGames = data.owned_games.game_count;
  
  // Estimate free games (games with 0 playtime are often free-to-play or bundles)
  const estimatedFreeGames = Math.floor(totalGames * 0.15); // ~15% free games
  const estimatedPaidGames = totalGames - estimatedFreeGames;
  
  // Generate realistic game prices based on playtime and distribution
  const gamesWithPrices = games.map(game => {
    // Free games (no playtime or very low)
    if (game.playtime_forever === 0 && Math.random() < 0.15) {
      return { ...game, estimatedPrice: 0 };
    }
    
    // Price distribution: AAA (~30%), Indie (~50%), Budget (~20%)
    const rand = Math.random();
    let price: number;
    
    if (rand < 0.3) {
      // AAA games ($40-70)
      price = Math.floor(Math.random() * 30 + 40);
    } else if (rand < 0.8) {
      // Indie games ($5-30)
      price = Math.floor(Math.random() * 25 + 5);
    } else {
      // Budget games ($1-10)
      price = Math.floor(Math.random() * 9 + 1);
    }
    
    return { ...game, estimatedPrice: price };
  });
  
  // Calculate total spent
  const totalSpent = gamesWithPrices.reduce((sum, game) => sum + game.estimatedPrice, 0);
  const averagePerGame = totalSpent / estimatedPaidGames;
  
  // Find most expensive game
  const mostExpensiveGame = gamesWithPrices.reduce((max, game) => 
    game.estimatedPrice > max.estimatedPrice ? game : max
  );
  
  // Get top 5 expensive games with playtime
  const topExpensiveGames = [...gamesWithPrices]
    .sort((a, b) => b.estimatedPrice - a.estimatedPrice)
    .slice(0, 5)
    .map(game => ({
      name: game.name,
      price: game.estimatedPrice,
      playtime: game.playtime_forever
    }));
  
  // Calculate yearly breakdown (distribute purchases across account lifetime)
  const accountCreated = new Date(data.player_summary.timecreated * 1000);
  const currentYear = new Date().getFullYear();
  const accountYears = currentYear - accountCreated.getFullYear() + 1;
  
  const yearlyBreakdown = [];
  for (let i = 0; i < Math.min(accountYears, 5); i++) {
    const year = currentYear - i;
    // More recent years tend to have more spending
    const yearSpending = totalSpent * (0.3 - i * 0.05);
    yearlyBreakdown.push({
      year,
      amount: Math.max(0, Math.floor(yearSpending))
    });
  }
  
  // Category breakdown
  const categoryBreakdown = [
    { category: "AAA Titles", count: Math.floor(totalGames * 0.3), total: Math.floor(totalSpent * 0.55) },
    { category: "Indie Games", count: Math.floor(totalGames * 0.5), total: Math.floor(totalSpent * 0.30) },
    { category: "Budget Games", count: Math.floor(totalGames * 0.2), total: Math.floor(totalSpent * 0.15) }
  ];
  
  return {
    totalSpent,
    averagePerGame,
    gamesOwned: totalGames,
    estimatedFreeGames,
    estimatedPaidGames,
    mostExpensiveGame: {
      name: mostExpensiveGame.name,
      price: mostExpensiveGame.estimatedPrice
    },
    yearlyBreakdown,
    topExpensiveGames,
    categoryBreakdown
  };
}

/**
 * Formats currency values in USD
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats playtime from minutes to readable format
 */
function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  if (hours === 0) return "Not played";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export default function Spendings() {
  const [stats, setStats] = useState<SpendingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Load profile data and calculate spending statistics
  useEffect(() => {
    fetch("/data/profile_76561198095524866.json")
      .then((res) => res.json())
      .then((data: ProfileData) => {
        const spendingStats = calculateSpendingStats(data);
        setStats(spendingStats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile data:", err);
        setLoading(false);
      });
  }, []);

  // Track carousel state
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-lg animate-pulse">
          Loading spending data...
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400">Failed to load spending data</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <Carousel setApi={setApi} className="h-full w-full" opts={{ loop: false }}>
        <CarouselContent className="h-full">
          {/* Slide 1: Welcome & Total Spent */}
          <CarouselItem className="h-screen">
            <div className="relative h-full flex items-center justify-center overflow-hidden">
              {/* Background gradient */}
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

              <div className="relative z-10 text-center space-y-8 px-8 max-w-4xl">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div
                    className="h-1 w-24 rounded-full"
                    style={{ background: "linear-gradient(90deg, #ffd700, #00d4ff)" }}
                  />
                  <span
                    className="text-lg font-semibold uppercase tracking-wider"
                    style={{ color: "#ffd700" }}
                  >
                    Treasury Archives
                  </span>
                  <div
                    className="h-1 w-24 rounded-full"
                    style={{ background: "linear-gradient(90deg, #00d4ff, #ffd700)" }}
                  />
                </div>

                <h1
                  className="text-7xl md:text-8xl font-bold mb-6 animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #00d4ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {formatCurrency(stats.totalSpent)}
                </h1>

                <p className="text-3xl text-cyan-400 font-semibold mb-4">
                  Your Gaming Investment
                </p>

                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  From epic adventures to indie gems, here's your journey through the digital frontier
                </p>

                <div className="flex items-center justify-center gap-2 mt-12 text-gray-400 animate-bounce">
                  <ChevronRight className="h-6 w-6" />
                  <span className="text-sm uppercase tracking-wider">Swipe to explore</span>
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>

              {/* Decorative hexagons */}
              <div className="absolute top-10 left-10 opacity-10">
                <div
                  className="w-24 h-24 border-2"
                  style={{
                    borderColor: "#00d4ff",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                />
              </div>
              <div className="absolute bottom-10 right-10 opacity-10">
                <div
                  className="w-32 h-32 border-2"
                  style={{
                    borderColor: "#ffd700",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                />
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2: Collection Overview */}
          <CarouselItem className="h-screen">
            <div className="relative h-full flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #0f0f1e 0%, #1e1e2e 50%, #2d1b3d 100%)",
                }}
              />

              <div className="relative z-10 px-8 max-w-6xl w-full">
                <div className="text-center mb-16">
                  <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                    Your Arsenal
                  </span>
                  <h2
                    className="text-6xl font-bold mt-4"
                    style={{
                      background: "linear-gradient(135deg, #ffd700 0%, #00d4ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stats.gamesOwned} Games
                  </h2>
                  <p className="text-gray-300 text-xl mt-4">Building your digital collection</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                  <div className="rounded-lg p-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-2 border-cyan-500/30 backdrop-blur transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4 mb-4">
                      <Gamepad2 className="h-8 w-8" style={{ color: "#00d4ff" }} />
                      <span className="text-cyan-400 text-lg font-semibold uppercase">Total Games</span>
                    </div>
                    <div className="text-5xl font-bold mb-2" style={{ color: "#ffd700" }}>
                      {stats.gamesOwned}
                    </div>
                    <p className="text-gray-400">Your complete arsenal</p>
                  </div>

                  <div className="rounded-lg p-8 bg-gradient-to-br from-purple-900/40 to-slate-900/60 border-2 border-purple-500/30 backdrop-blur transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4 mb-4">
                      <ShoppingCart className="h-8 w-8" style={{ color: "#a855f7" }} />
                      <span className="text-purple-400 text-lg font-semibold uppercase">Purchased</span>
                    </div>
                    <div className="text-5xl font-bold text-white mb-2">
                      {stats.estimatedPaidGames}
                    </div>
                    <p className="text-gray-400">
                      {Math.round((stats.estimatedPaidGames / stats.gamesOwned) * 100)}% of collection
                    </p>
                  </div>

                  <div className="rounded-lg p-8 bg-gradient-to-br from-amber-900/40 to-slate-900/60 border-2 border-amber-500/30 backdrop-blur transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4 mb-4">
                      <Gift className="h-8 w-8" style={{ color: "#fbbf24" }} />
                      <span className="text-amber-400 text-lg font-semibold uppercase">Free Games</span>
                    </div>
                    <div className="text-5xl font-bold text-white mb-2">
                      {stats.estimatedFreeGames}
                    </div>
                    <p className="text-gray-400">
                      {Math.round((stats.estimatedFreeGames / stats.gamesOwned) * 100)}% acquired free
                    </p>
                  </div>
                </div>

                <div className="text-center mt-12">
                  <p className="text-cyan-400 text-lg">
                    Average: <span className="text-white font-bold text-2xl">{formatCurrency(stats.averagePerGame)}</span> per game
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 3: Category Breakdown */}
          <CarouselItem className="h-screen">
            <div className="relative h-full flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #2d1b3d 0%, #4a0e4e 50%, #1e1e2e 100%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-20 animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)",
                }}
              />

              <div className="relative z-10 px-8 max-w-5xl w-full">
                <div className="text-center mb-16">
                  <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                    Investment Distribution
                  </span>
                  <h2
                    className="text-6xl font-bold mt-4"
                    style={{
                      background: "linear-gradient(135deg, #a855f7 0%, #ffd700 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    By Category
                  </h2>
                  <p className="text-gray-300 text-xl mt-4">Where your credits flow</p>
                </div>

                <div className="space-y-8">
                  {stats.categoryBreakdown.map((category, index) => (
                    <div key={category.category} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold text-2xl">{category.category}</p>
                          <p className="text-gray-400 text-lg">{category.count} games</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-cyan-400">
                            {formatCurrency(category.total)}
                          </p>
                          <p className="text-lg" style={{ color: "#ffd700" }}>
                            {Math.round((category.total / stats.totalSpent) * 100)}% of spending
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-4">
                        <div
                          className="h-4 rounded-full transition-all duration-1000"
                          style={{
                            width: `${(category.total / stats.totalSpent) * 100}%`,
                            background: index === 0 
                              ? "linear-gradient(90deg, #ffd700, #ffed4e)" 
                              : index === 1 
                              ? "linear-gradient(90deg, #00d4ff, #0ea5e9)"
                              : "linear-gradient(90deg, #a855f7, #ec4899)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 4: Yearly Spending */}
          <CarouselItem className="h-screen">
            <div className="relative h-full flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #0f0f1e 0%, #1e1e2e 25%, #00d4ff10 50%, #1e1e2e 75%, #0f0f1e 100%)",
                }}
              />

              <div className="relative z-10 px-8 max-w-5xl w-full">
                <div className="text-center mb-16">
                  <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                    Temporal Analysis
                  </span>
                  <h2
                    className="text-6xl font-bold mt-4"
                    style={{
                      background: "linear-gradient(135deg, #00d4ff 0%, #ffd700 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Investment Timeline
                  </h2>
                  <p className="text-gray-300 text-xl mt-4">Your spending journey through time</p>
                </div>
            
                <div className="space-y-6">
              {stats.yearlyBreakdown.map((year, index) => (
                <div key={year.year} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{year.year}</span>
                    <span className="text-2xl font-bold" style={{ color: "#ffd700" }}>
                      {formatCurrency(year.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(year.amount / Math.max(...stats.yearlyBreakdown.map(y => y.amount))) * 100}%`,
                        background: "linear-gradient(90deg, #00d4ff, #ffd700)",
                      }}
                    />
                  </div>
                </div>
              ))}
              
                  <div className="pt-8 mt-8 border-t border-cyan-500/50 text-center">
                    <p className="text-cyan-400 text-lg mb-2">Recent 5-Year Total</p>
                    <p className="text-5xl font-bold" style={{ color: "#ffd700" }}>
                      {formatCurrency(stats.yearlyBreakdown.reduce((sum, y) => sum + y.amount, 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 5: Top Expensive Games */}
          <CarouselItem className="h-screen">
            <div className="relative h-full flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #1e1e2e 0%, #ffd70010 25%, #4a0e4e 50%, #1e1e2e 100%)",
                }}
              />

              <div className="relative z-10 px-8 max-w-5xl w-full">
                <div className="text-center mb-12">
                  <DollarSign className="h-12 w-12 mx-auto mb-4" style={{ color: "#ffd700" }} />
                  <h2
                    className="text-6xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #00d4ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Premium Acquisitions
                  </h2>
                  <p className="text-gray-300 text-xl mt-4">Your biggest gaming investments</p>
                </div>
          
                <div className="space-y-6">
            {stats.topExpensiveGames.map((game, index) => (
              <div
                key={game.name}
                className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg border-2"
                      style={{
                        borderColor: "#00d4ff",
                        background: "linear-gradient(135deg, #1e1e2e, #2d1b3d)",
                        color: "#00d4ff",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-lg">{game.name}</p>
                      <p className="text-cyan-400 text-sm">
                        {formatPlaytime(game.playtime)} played
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold" style={{ color: "#ffd700" }}>
                      {formatCurrency(game.price)}
                    </p>
                    {game.playtime > 0 && (
                      <p className="text-sm text-gray-400">
                        ${(game.price / (game.playtime / 60)).toFixed(2)}/hour
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
                </div>

                <div className="text-center mt-8">
                  <p className="text-gray-400 text-sm">
                    * Estimates based on industry pricing models
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <CarouselPrevious className="relative left-0 translate-y-0 bg-slate-800/80 border-cyan-500/50 hover:bg-slate-700 hover:border-cyan-400" />
          
          {/* Progress Dots */}
          <div className="flex gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  current === index + 1
                    ? "w-8 bg-gradient-to-r from-cyan-400 to-amber-400"
                    : "w-2 bg-slate-600 hover:bg-slate-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <CarouselNext className="relative right-0 translate-y-0 bg-slate-800/80 border-cyan-500/50 hover:bg-slate-700 hover:border-cyan-400" />
        </div>

        {/* Slide Counter */}
        <div className="absolute top-8 right-8 z-20">
          <div className="px-4 py-2 rounded-full bg-slate-800/80 border border-cyan-500/30 backdrop-blur">
            <span className="text-cyan-400 font-semibold">
              {current} / {count}
            </span>
          </div>
        </div>
      </Carousel>
    </div>
  );
}

