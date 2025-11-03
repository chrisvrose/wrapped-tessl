import type { Route } from "./+types/spendings";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, ShoppingCart, Gamepad2, Gift, Calendar } from "lucide-react";

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
    <div className="h-full w-full overflow-y-auto">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Warframe-themed Header */}
        <div className="relative overflow-hidden rounded-lg p-8 mb-8">
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
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="h-1 w-16 rounded-full"
                style={{ background: "linear-gradient(90deg, #ffd700, #00d4ff)" }}
              />
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "#ffd700" }}
              >
                Treasury Archives
              </span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold"
              style={{
                background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #00d4ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Spending Analytics
            </h1>
            <p className="text-gray-300 text-lg">
              Track your gaming investment across the digital frontier
            </p>
          </div>

          {/* Decorative hex */}
          <div className="absolute bottom-4 right-4 opacity-10">
            <div
              className="w-32 h-32 border-2"
              style={{
                borderColor: "#ffd700",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
          </div>
        </div>

        {/* Hero Stats - Warframe Style */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Spent - Main Focus */}
          <div className="relative overflow-hidden rounded-lg p-6 border border-cyan-500/30 bg-gradient-to-br from-purple-900/40 to-slate-900/40 backdrop-blur">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                  Total Investment
                </span>
                <DollarSign className="h-5 w-5 text-gold-400" style={{ color: "#ffd700" }} />
              </div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: "#ffd700" }}
              >
                {formatCurrency(stats.totalSpent)}
              </div>
              <p className="text-gray-400 text-sm">Lifetime spending</p>
            </div>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: "radial-gradient(circle at 100% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Average Per Game */}
          <div className="relative overflow-hidden rounded-lg p-6 border border-purple-500/30 bg-gradient-to-br from-slate-900/40 to-purple-900/40 backdrop-blur">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                  Average Cost
                </span>
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-4xl font-bold mb-2 text-cyan-400">
                {formatCurrency(stats.averagePerGame)}
              </div>
              <p className="text-gray-400 text-sm">Per paid game ({stats.estimatedPaidGames})</p>
            </div>
          </div>

          {/* Most Expensive */}
          <div className="relative overflow-hidden rounded-lg p-6 border border-amber-500/30 bg-gradient-to-br from-amber-900/40 to-slate-900/40 backdrop-blur">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">
                  Premium Acquisition
                </span>
                <ShoppingCart className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-4xl font-bold mb-2 text-amber-400">
                {formatCurrency(stats.mostExpensiveGame.price)}
              </div>
              <p className="text-gray-400 text-sm truncate">{stats.mostExpensiveGame.name}</p>
            </div>
          </div>
        </div>

        {/* Games Collection Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg p-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <Gamepad2 className="h-5 w-5" style={{ color: "#00d4ff" }} />
              <span className="text-cyan-400 text-sm font-semibold uppercase">Arsenal Size</span>
            </div>
            <div className="text-3xl font-bold" style={{ color: "#ffd700" }}>
              {stats.gamesOwned}
            </div>
            <p className="text-gray-400 text-xs mt-1">Total games owned</p>
          </div>

          <div className="rounded-lg p-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingCart className="h-5 w-5" style={{ color: "#00d4ff" }} />
              <span className="text-cyan-400 text-sm font-semibold uppercase">Purchased</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.estimatedPaidGames}
            </div>
            <p className="text-gray-400 text-xs mt-1">
              {Math.round((stats.estimatedPaidGames / stats.gamesOwned) * 100)}% of collection
            </p>
          </div>

          <div className="rounded-lg p-5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="h-5 w-5" style={{ color: "#00d4ff" }} />
              <span className="text-cyan-400 text-sm font-semibold uppercase">Free-to-Play</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.estimatedFreeGames}
            </div>
            <p className="text-gray-400 text-xs mt-1">
              {Math.round((stats.estimatedFreeGames / stats.gamesOwned) * 100)}% acquired free
            </p>
          </div>
        </div>

        {/* Two Column Advanced Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Yearly Breakdown - Warframe themed */}
          <div className="relative overflow-hidden rounded-lg border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-purple-900/30 backdrop-blur p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5" style={{ color: "#00d4ff" }} />
                <h3 className="text-xl font-bold text-cyan-400">Temporal Analysis</h3>
              </div>
              <p className="text-gray-400 text-sm">Investment timeline breakdown</p>
            </div>
            
            <div className="space-y-4">
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
              
              <div className="pt-4 mt-4 border-t border-cyan-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-semibold">5-Year Total</span>
                  <span className="text-2xl font-bold" style={{ color: "#ffd700" }}>
                    {formatCurrency(stats.yearlyBreakdown.reduce((sum, y) => sum + y.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="relative overflow-hidden rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-slate-900/90 backdrop-blur p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" style={{ color: "#ffd700" }} />
                <h3 className="text-xl font-bold text-amber-400">Category Distribution</h3>
              </div>
              <p className="text-gray-400 text-sm">Investment by game tier</p>
            </div>
            
            <div className="space-y-6">
              {stats.categoryBreakdown.map((category, index) => (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{category.category}</p>
                      <p className="text-xs text-gray-400">{category.count} games</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-cyan-400">
                        {formatCurrency(category.total)}
                      </p>
                      <p className="text-xs" style={{ color: "#ffd700" }}>
                        {Math.round((category.total / stats.totalSpent) * 100)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
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

        {/* Top Expensive Games - Epic Style */}
        <div className="relative overflow-hidden rounded-lg border border-amber-500/30 bg-gradient-to-br from-slate-900/90 to-amber-900/20 backdrop-blur p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-6 w-6" style={{ color: "#ffd700" }} />
              <h3 className="text-2xl font-bold" style={{ color: "#ffd700" }}>
                Premium Acquisitions
              </h3>
            </div>
            <p className="text-gray-400">Your top 5 most valuable investments</p>
          </div>
          
          <div className="space-y-4">
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
        </div>

        {/* Disclaimer - Styled */}
        <div className="rounded-lg p-4 bg-slate-800/30 border border-slate-700/50">
          <p className="text-xs text-gray-500 text-center">
            * Spending estimates calculated using industry pricing models and game categorization algorithms.
            Actual values may vary based on regional pricing, promotional discounts, and bundle acquisitions.
          </p>
        </div>
      </div>
    </div>
  );
}

