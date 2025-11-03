"""
Steam Data Dataset Generator
Fetches data from Steam API and saves it as JSON datasets for use in the frontend
"""

import os
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
from dotenv import load_dotenv
from steam_api import SteamAPI, format_playtime

# Load environment variables
load_dotenv()

# Configuration
OUTPUT_DIR = Path("public/data")
API_KEY = os.getenv("STEAMKEY")  # Using STEAMKEY from .env
PLAYER_ID = os.getenv("PLAYER_ID")  # Using PLAYER_ID from .env


class SteamDatasetGenerator:
    """Generate datasets from Steam API"""

    def __init__(self, api_key: str):
        self.api = SteamAPI(api_key)
        self.output_dir = OUTPUT_DIR
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def save_json(self, data: Any, filename: str):
        """Save data as JSON file"""
        filepath = self.output_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved: {filepath}")

    def generate_player_profile(self, steam_id: str) -> Dict[str, Any]:
        """Generate complete player profile dataset"""
        print(f"\n📊 Generating profile for Steam ID: {steam_id}")
        
        profile_data = {
            "steam_id": steam_id,
            "generated_at": datetime.now().isoformat(),
            "player_summary": {},
            "owned_games": {},
            "recently_played": {},
            "steam_level": 0,
            "badges": {},
            "stats": {
                "total_games": 0,
                "total_playtime_hours": 0,
                "games_played_2weeks": 0
            }
        }

        # Get player summary
        print("  Fetching player summary...")
        summary_data = self.api.get_player_summaries([steam_id])
        if summary_data.get("response", {}).get("players"):
            profile_data["player_summary"] = summary_data["response"]["players"][0]

        # Get owned games
        print("  Fetching owned games...")
        games_data = self.api.get_owned_games(steam_id)
        if games_data.get("response"):
            profile_data["owned_games"] = games_data["response"]
            profile_data["stats"]["total_games"] = games_data["response"].get("game_count", 0)
            
            # Calculate total playtime
            total_minutes = sum(
                game.get("playtime_forever", 0) 
                for game in games_data["response"].get("games", [])
            )
            profile_data["stats"]["total_playtime_hours"] = round(total_minutes / 60, 2)

        # Get recently played games
        print("  Fetching recently played games...")
        recent_data = self.api.get_recently_played_games(steam_id)
        if recent_data.get("response"):
            profile_data["recently_played"] = recent_data["response"]
            profile_data["stats"]["games_played_2weeks"] = recent_data["response"].get("total_count", 0)

        # Get Steam level
        print("  Fetching Steam level...")
        level_data = self.api.get_steam_level(steam_id)
        if level_data.get("response"):
            profile_data["steam_level"] = level_data["response"].get("player_level", 0)

        # Get badges
        print("  Fetching badges...")
        badges_data = self.api.get_badges(steam_id)
        if badges_data.get("response"):
            profile_data["badges"] = badges_data["response"]

        # Get achievement summary
        print("  Fetching achievement summary...")
        try:
            achievement_summary = self.api.get_achievement_summary_for_games(steam_id)
            profile_data["achievement_summary"] = achievement_summary
            profile_data["stats"]["total_achievements"] = achievement_summary.get("total_achievements", 0)
            profile_data["stats"]["unlocked_achievements"] = achievement_summary.get("total_unlocked", 0)
            profile_data["stats"]["achievement_completion"] = achievement_summary.get("completion_percentage", 0)
            profile_data["stats"]["perfect_games"] = len(achievement_summary.get("perfect_games", []))
        except Exception as e:
            print(f"  ⚠ Could not fetch achievement summary: {e}")
            profile_data["achievement_summary"] = {}

        return profile_data

    def generate_game_stats(self, app_id: int, app_name: str = None) -> Dict[str, Any]:
        """Generate game statistics dataset"""
        print(f"\n🎮 Generating stats for App ID: {app_id} ({app_name or 'Unknown'})")
        
        game_data = {
            "app_id": app_id,
            "app_name": app_name,
            "generated_at": datetime.now().isoformat(),
            "current_players": 0,
            "achievement_percentages": [],
            "news": []
        }

        # Get current player count
        print("  Fetching current players...")
        players_data = self.api.get_number_of_current_players(app_id)
        if players_data.get("response"):
            game_data["current_players"] = players_data["response"].get("player_count", 0)

        # Get achievement percentages
        print("  Fetching achievement percentages...")
        achievements_data = self.api.get_global_achievement_percentages(app_id)
        if achievements_data.get("achievementpercentages"):
            game_data["achievement_percentages"] = achievements_data["achievementpercentages"].get("achievements", [])

        # Get news
        print("  Fetching news...")
        news_data = self.api.get_news_for_app(app_id, count=5, max_length=300)
        if news_data.get("appnews"):
            game_data["news"] = news_data["appnews"].get("newsitems", [])

        return game_data

    def generate_popular_games_stats(self, game_list: List[Dict[str, Any]]):
        """Generate stats for multiple popular games"""
        print("\n🎯 Generating popular games statistics...")
        
        all_games_stats = []
        
        for game in game_list:
            try:
                stats = self.generate_game_stats(game["app_id"], game["name"])
                all_games_stats.append(stats)
            except Exception as e:
                print(f"  ✗ Error fetching {game['name']}: {e}")
                continue

        self.save_json(all_games_stats, "popular_games_stats.json")

    def generate_top_games_leaderboard(self, steam_id: str):
        """Generate a leaderboard of top played games"""
        print("\n🏆 Generating top games leaderboard...")
        
        games_data = self.api.get_owned_games(steam_id)
        
        if not games_data.get("response", {}).get("games"):
            print("  ✗ No games data available")
            return

        games = games_data["response"]["games"]
        
        # Sort by playtime
        sorted_games = sorted(
            games,
            key=lambda x: x.get("playtime_forever", 0),
            reverse=True
        )[:50]  # Top 50

        leaderboard = {
            "steam_id": steam_id,
            "generated_at": datetime.now().isoformat(),
            "total_games": len(games),
            "top_games": [
                {
                    "rank": idx + 1,
                    "app_id": game.get("appid"),
                    "name": game.get("name"),
                    "playtime_minutes": game.get("playtime_forever", 0),
                    "playtime_hours": round(game.get("playtime_forever", 0) / 60, 2),
                    "playtime_formatted": format_playtime(game.get("playtime_forever", 0)),
                    "playtime_2weeks_minutes": game.get("playtime_2weeks", 0),
                    "img_icon_url": game.get("img_icon_url"),
                    "img_logo_url": game.get("img_logo_url"),
                }
                for idx, game in enumerate(sorted_games)
            ]
        }

        self.save_json(leaderboard, f"top_games_{steam_id}.json")

    def generate_enriched_games_dataset(self, steam_id: str, limit: int = 20):
        """Generate enriched game data with achievement info and current players"""
        print(f"\n🎨 Generating enriched games dataset (top {limit} by playtime)...")
        
        try:
            # Get enriched game info
            enriched_games = self.api.get_games_with_info(steam_id, limit=limit)
            
            dataset = {
                "steam_id": steam_id,
                "generated_at": datetime.now().isoformat(),
                "games_count": len(enriched_games),
                "games": enriched_games
            }
            
            self.save_json(dataset, f"enriched_games_{steam_id}.json")
            return dataset
        except Exception as e:
            print(f"  ✗ Error generating enriched games dataset: {e}")
            return None

    def generate_achievements_dataset(self, steam_id: str):
        """Generate detailed achievements dataset"""
        print("\n🏆 Generating achievements dataset...")
        
        try:
            # Get achievement summary
            summary = self.api.get_achievement_summary_for_games(steam_id)
            
            dataset = {
                "steam_id": steam_id,
                "generated_at": datetime.now().isoformat(),
                "summary": {
                    "total_games": summary.get("total_games", 0),
                    "games_with_achievements": summary.get("games_with_achievements", 0),
                    "total_achievements": summary.get("total_achievements", 0),
                    "total_unlocked": summary.get("total_unlocked", 0),
                    "completion_percentage": summary.get("completion_percentage", 0),
                    "perfect_games_count": len(summary.get("perfect_games", []))
                },
                "perfect_games": summary.get("perfect_games", [])[:10],  # Top 10 perfect games
                "games_with_progress": summary.get("games_with_progress", [])[:20]  # Top 20 in-progress
            }
            
            self.save_json(dataset, f"achievements_{steam_id}.json")
            return dataset
        except Exception as e:
            print(f"  ✗ Error generating achievements dataset: {e}")
            return None

    def run_all(self, steam_ids: List[str]):
        """Run all dataset generation"""
        print("=" * 70)
        print("STEAM DATASET GENERATOR")
        print("=" * 70)
        print(f"Output directory: {self.output_dir.absolute()}")
        print(f"Generating datasets for {len(steam_ids)} player(s)")

        # Generate player profiles
        for steam_id in steam_ids:
            try:
                profile = self.generate_player_profile(steam_id)
                self.save_json(profile, f"profile_{steam_id}.json")
                
                # Generate top games leaderboard
                self.generate_top_games_leaderboard(steam_id)
                
                # Generate enriched games dataset (top 20 by playtime)
                self.generate_enriched_games_dataset(steam_id, limit=20)
                
                # Generate achievements dataset
                self.generate_achievements_dataset(steam_id)
                
            except Exception as e:
                print(f"✗ Error generating profile for {steam_id}: {e}")
                import traceback
                traceback.print_exc()

        print("\n" + "=" * 70)
        print("✓ Dataset generation complete!")
        print("=" * 70)


def main():
    """Main entry point"""
    
    if not API_KEY:
        print("❌ Error: STEAMKEY not found in environment variables")
        print("Please add to .env file: STEAMKEY=your_key_here")
        print("Get your key from: https://steamcommunity.com/dev/apikey")
        return

    # Determine which player ID to use
    import sys
    player_ids = []
    
    # Priority 1: Command line arguments
    if len(sys.argv) > 1:
        player_ids = sys.argv[1:]
        print(f"Using player IDs from arguments: {player_ids}")
    # Priority 2: PLAYER_ID from .env
    elif PLAYER_ID:
        player_ids = [PLAYER_ID]
        print(f"Using PLAYER_ID from .env: {PLAYER_ID}")
    else:
        print("❌ Error: No player ID specified")
        print("Please either:")
        print("  1. Add PLAYER_ID=your_steam_id to .env")
        print("  2. Pass as argument: python generate_datasets.py 76561198095524866")
        return

    generator = SteamDatasetGenerator(API_KEY)
    generator.run_all(player_ids)


if __name__ == "__main__":
    main()
