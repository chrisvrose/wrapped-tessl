"""
Steam API Information Getter
A comprehensive Python client for interacting with Steam Web API

Documentation: https://steamcommunity.com/dev
API Reference: https://steamapi.xpaw.me/
"""

import requests
import json
import time
from typing import Optional, List, Dict, Any
from urllib.parse import urlencode


class SteamAPI:
    """Steam Web API Client"""

    BASE_URL = "https://api.steampowered.com"

    def __init__(self, api_key: str):
        """
        Initialize Steam API client

        Args:
            api_key: Your Steam Web API key from https://steamcommunity.com/dev/apikey
        """
        self.api_key = api_key
        self.session = requests.Session()
        self.last_request_time = 0
        self.min_request_interval = 0.2  # 200ms between requests to avoid rate limiting

    def _make_request(self, interface: str, method: str, version: str = "v1",
                     params: Optional[Dict[str, Any]] = None,
                     format_type: str = "json") -> Dict[str, Any]:
        """
        Make a request to the Steam API

        Args:
            interface: API interface (e.g., 'ISteamUser')
            method: Method name (e.g., 'GetPlayerSummaries')
            version: API version (default: 'v1')
            params: Additional parameters
            format_type: Response format ('json', 'xml', or 'vdf')

        Returns:
            Parsed JSON response
        """
        # Rate limiting
        current_time = time.time()
        time_since_last_request = current_time - self.last_request_time
        if time_since_last_request < self.min_request_interval:
            time.sleep(self.min_request_interval - time_since_last_request)
        
        url = f"{self.BASE_URL}/{interface}/{method}/{version}/"

        request_params = {"key": self.api_key, "format": format_type}
        if params:
            request_params.update(params)

        try:
            response = self.session.get(url, params=request_params, timeout=10)
            self.last_request_time = time.time()
            
            # Better error handling
            if response.status_code == 400:
                print(f"❌ Bad Request (400) for {interface}/{method}")
                print(f"   URL: {url}")
                print(f"   Params: {request_params}")
                print(f"   Response: {response.text[:200]}")
                return {}
            elif response.status_code == 401:
                print(f"❌ Unauthorized (401) - Check your API key")
                return {}
            elif response.status_code == 403:
                print(f"⚠️  Forbidden (403) - {interface}/{method} (might be private profile)")
                return {}
            elif response.status_code == 429:
                print(f"⚠️  Rate Limited (429) - Sleeping for 60 seconds...")
                time.sleep(60)
                return {}
            elif response.status_code == 500:
                print(f"⚠️  Server Error (500) - Steam API is having issues")
                return {}
            
            response.raise_for_status()
            return response.json() if format_type == "json" else response.text
        except requests.exceptions.Timeout:
            print(f"⏱️  Timeout for {interface}/{method}")
            return {}
        except requests.exceptions.RequestException as e:
            print(f"❌ Error making request to {interface}/{method}: {e}")
            return {}

    # ==================== ISteamUser Interface ====================

    def get_player_summaries(self, steam_ids: List[str]) -> Dict[str, Any]:
        """
        Get basic profile information for up to 100 Steam IDs

        Returns: persona name, profile URL, avatars, online status, etc.
        """
        steam_ids_str = ",".join(steam_ids)
        return self._make_request(
            "ISteamUser",
            "GetPlayerSummaries",
            "v0002",
            {"steamids": steam_ids_str}
        )

    def get_friend_list(self, steam_id: str, relationship: str = "friend") -> Dict[str, Any]:
        """
        Get user's friends list (requires public profile)

        Args:
            steam_id: 64-bit Steam ID
            relationship: Relationship filter (default: 'friend')
        """
        return self._make_request(
            "ISteamUser",
            "GetFriendList",
            "v0001",
            {"steamid": steam_id, "relationship": relationship}
        )

    def resolve_vanity_url(self, vanity_url: str, url_type: int = 1) -> Dict[str, Any]:
        """
        Resolve vanity URL to Steam ID

        Args:
            vanity_url: The vanity URL part (e.g., 'gabelogannewell' from steamcommunity.com/id/gabelogannewell)
            url_type: Type of vanity URL (1=individual, 2=group, 3=official game group)
        """
        return self._make_request(
            "ISteamUser",
            "ResolveVanityURL",
            "v0001",
            {"vanityurl": vanity_url, "url_type": url_type}
        )

    # ==================== IPlayerService Interface ====================

    def get_owned_games(self, steam_id: str, include_appinfo: bool = True,
                       include_played_free_games: bool = True) -> Dict[str, Any]:
        """
        Get list of games owned by player

        Args:
            steam_id: 64-bit Steam ID
            include_appinfo: Include game name and logo info (1 or 0)
            include_played_free_games: Include free games the user has played
        """
        params = {
            "steamid": steam_id,
            "include_appinfo": 1 if include_appinfo else 0,
            "include_played_free_games": 1 if include_played_free_games else 0
        }
        
        return self._make_request(
            "IPlayerService",
            "GetOwnedGames",
            "v0001",
            params
        )

    def get_recently_played_games(self, steam_id: str, count: int = 0) -> Dict[str, Any]:
        """
        Get games played in the last 2 weeks

        Args:
            steam_id: 64-bit Steam ID
            count: Number of games to return (0 = all)
        """
        return self._make_request(
            "IPlayerService",
            "GetRecentlyPlayedGames",
            "v0001",
            {"steamid": steam_id, "count": count}
        )

    def get_steam_level(self, steam_id: str) -> Dict[str, Any]:
        """Get Steam Level of a user"""
        return self._make_request(
            "IPlayerService",
            "GetSteamLevel",
            "v1",
            {"steamid": steam_id}
        )

    def get_badges(self, steam_id: str) -> Dict[str, Any]:
        """Get badges that a user has unlocked"""
        return self._make_request(
            "IPlayerService",
            "GetBadges",
            "v1",
            {"steamid": steam_id}
        )

    # ==================== ISteamUserStats Interface ====================

    def get_player_achievements(self, steam_id: str, app_id: int,
                               language: str = "en") -> Dict[str, Any]:
        """
        Get player achievements for a specific game

        Args:
            steam_id: 64-bit Steam ID
            app_id: Game's App ID
            language: Language for localized strings
        """
        return self._make_request(
            "ISteamUserStats",
            "GetPlayerAchievements",
            "v0001",
            {"steamid": steam_id, "appid": app_id, "l": language}
        )

    def get_user_stats_for_game(self, steam_id: str, app_id: int) -> Dict[str, Any]:
        """Get user statistics for a specific game"""
        return self._make_request(
            "ISteamUserStats",
            "GetUserStatsForGame",
            "v0002",
            {"steamid": steam_id, "appid": app_id}
        )

    def get_global_achievement_percentages(self, app_id: int) -> Dict[str, Any]:
        """Get global achievement completion percentages for a game"""
        return self._make_request(
            "ISteamUserStats",
            "GetGlobalAchievementPercentagesForApp",
            "v0002",
            {"gameid": app_id}
        )

    def get_number_of_current_players(self, app_id: int) -> Dict[str, Any]:
        """Get current number of players for an app"""
        return self._make_request(
            "ISteamUserStats",
            "GetNumberOfCurrentPlayers",
            "v1",
            {"appid": app_id}
        )

    # ==================== ISteamNews Interface ====================

    def get_news_for_app(self, app_id: int, count: int = 3,
                        max_length: int = 300) -> Dict[str, Any]:
        """
        Get news for a specific game

        Args:
            app_id: Game's App ID
            count: Number of news items to return
            max_length: Maximum length of each news item description
        """
        return self._make_request(
            "ISteamNews",
            "GetNewsForApp",
            "v0002",
            {"appid": app_id, "count": count, "maxlength": max_length}
        )

    # ==================== ISteamApps Interface ====================

    def get_app_list(self) -> Dict[str, Any]:
        """Get complete list of all Steam apps (games, DLC, etc.)"""
        return self._make_request(
            "ISteamApps",
            "GetAppList",
            "v2"
        )

    def get_servers_at_address(self, addr: str) -> Dict[str, Any]:
        """Get list of game servers at a given IP address"""
        return self._make_request(
            "ISteamApps",
            "GetServersAtAddress",
            "v1",
            {"addr": addr}
        )

    # ==================== IEconService Interface (Trading/Inventory) ====================

    def get_trade_offers(self, get_sent_offers: bool = True,
                        get_received_offers: bool = True,
                        get_descriptions: bool = True) -> Dict[str, Any]:
        """
        Get trade offers for the authenticated user
        Requires OAuth token or special permissions
        """
        return self._make_request(
            "IEconService",
            "GetTradeOffers",
            "v1",
            {
                "get_sent_offers": 1 if get_sent_offers else 0,
                "get_received_offers": 1 if get_received_offers else 0,
                "get_descriptions": 1 if get_descriptions else 0
            }
        )

    def get_trade_history(self, max_trades: int = 100) -> Dict[str, Any]:
        """Get trade history (requires authentication)"""
        return self._make_request(
            "IEconService",
            "GetTradeHistory",
            "v1",
            {"max_trades": max_trades}
        )

    # ==================== ISteamWebAPIUtil Interface ====================

    def get_supported_api_list(self) -> Dict[str, Any]:
        """Get list of all supported API interfaces and methods"""
        return self._make_request(
            "ISteamWebAPIUtil",
            "GetSupportedAPIList",
            "v1"
        )

    def get_server_info(self) -> Dict[str, Any]:
        """Get WebAPI server information"""
        return self._make_request(
            "ISteamWebAPIUtil",
            "GetServerInfo",
            "v1"
        )

    # ==================== Enhanced User Game Methods ====================

    def get_user_games_with_achievements(self, steam_id: str) -> Dict[str, Any]:
        """
        Get all games owned by user with their achievement data and global percentages
        
        Args:
            steam_id: 64-bit Steam ID
            
        Returns:
            Dictionary with game info, user achievements, and global achievement percentages
        """
        result = {
            "steam_id": steam_id,
            "games": []
        }
        
        # Get owned games
        owned_games = self.get_owned_games(steam_id, include_appinfo=True)
        if not owned_games.get("response", {}).get("games"):
            return result
        
        games = owned_games["response"]["games"]
        
        for game in games:
            app_id = game.get("appid")
            game_data = {
                "app_id": app_id,
                "name": game.get("name"),
                "playtime_forever": game.get("playtime_forever", 0),
                "playtime_2weeks": game.get("playtime_2weeks", 0),
                "img_icon_url": game.get("img_icon_url"),
                "img_logo_url": game.get("img_logo_url"),
                "user_achievements": None,
                "global_achievements": None,
                "achievement_completion": 0
            }
            
            # Try to get user achievements (may fail if game has no achievements or stats are private)
            try:
                achievements = self.get_player_achievements(steam_id, app_id)
                if achievements.get("playerstats", {}).get("success"):
                    user_achievements = achievements["playerstats"].get("achievements", [])
                    game_data["user_achievements"] = user_achievements
                    
                    # Calculate completion percentage
                    if user_achievements:
                        completed = sum(1 for a in user_achievements if a.get("achieved") == 1)
                        total = len(user_achievements)
                        game_data["achievement_completion"] = round((completed / total) * 100, 2) if total > 0 else 0
            except Exception:
                pass  # Game might not have achievements
            
            # Try to get global achievement percentages
            try:
                global_achievements = self.get_global_achievement_percentages(app_id)
                if global_achievements.get("achievementpercentages"):
                    game_data["global_achievements"] = global_achievements["achievementpercentages"].get("achievements", [])
            except Exception:
                pass  # Game might not have achievements
            
            result["games"].append(game_data)
        
        return result

    def get_games_with_info(self, steam_id: str, limit: int = None) -> List[Dict[str, Any]]:
        """
        Get enriched game information for user's library
        
        Args:
            steam_id: 64-bit Steam ID
            limit: Optional limit on number of games to process (for performance)
            
        Returns:
            List of games with enriched data including current players and global achievements
        """
        games_list = []
        
        # Get owned games
        owned_games = self.get_owned_games(steam_id, include_appinfo=True)
        if not owned_games.get("response", {}).get("games"):
            return games_list
        
        games = owned_games["response"]["games"]
        if limit:
            games = games[:limit]
        
        for game in games:
            app_id = game.get("appid")
            game_info = {
                "app_id": app_id,
                "name": game.get("name"),
                "playtime_forever": game.get("playtime_forever", 0),
                "playtime_2weeks": game.get("playtime_2weeks", 0),
                "playtime_hours": round(game.get("playtime_forever", 0) / 60, 2),
                "img_icon_url": game.get("img_icon_url"),
                "img_logo_url": game.get("img_logo_url"),
                "has_community_visible_stats": game.get("has_community_visible_stats", False),
                "current_players": None,
                "global_achievements": []
            }
            
            # Get current player count
            try:
                players = self.get_number_of_current_players(app_id)
                if players.get("response"):
                    game_info["current_players"] = players["response"].get("player_count", 0)
            except Exception:
                pass
            
            # Get global achievement percentages
            try:
                achievements = self.get_global_achievement_percentages(app_id)
                if achievements.get("achievementpercentages"):
                    game_info["global_achievements"] = achievements["achievementpercentages"].get("achievements", [])
            except Exception:
                pass
            
            games_list.append(game_info)
        
        return games_list

    def get_achievement_summary_for_games(self, steam_id: str) -> Dict[str, Any]:
        """
        Get achievement completion summary across all user's games
        
        Args:
            steam_id: 64-bit Steam ID
            
        Returns:
            Summary statistics about achievements across all games
        """
        summary = {
            "steam_id": steam_id,
            "total_games": 0,
            "games_with_achievements": 0,
            "total_achievements": 0,
            "total_unlocked": 0,
            "completion_percentage": 0,
            "perfect_games": [],
            "games_with_progress": []
        }
        
        # Get owned games
        owned_games = self.get_owned_games(steam_id, include_appinfo=True)
        if not owned_games.get("response", {}).get("games"):
            return summary
        
        games = owned_games["response"]["games"]
        summary["total_games"] = len(games)
        
        for game in games:
            app_id = game.get("appid")
            
            try:
                achievements = self.get_player_achievements(steam_id, app_id)
                if achievements.get("playerstats", {}).get("success"):
                    user_achievements = achievements["playerstats"].get("achievements", [])
                    
                    if user_achievements:
                        summary["games_with_achievements"] += 1
                        total = len(user_achievements)
                        unlocked = sum(1 for a in user_achievements if a.get("achieved") == 1)
                        
                        summary["total_achievements"] += total
                        summary["total_unlocked"] += unlocked
                        
                        completion = round((unlocked / total) * 100, 2) if total > 0 else 0
                        
                        game_progress = {
                            "app_id": app_id,
                            "name": game.get("name"),
                            "total_achievements": total,
                            "unlocked": unlocked,
                            "completion": completion
                        }
                        
                        if completion == 100:
                            summary["perfect_games"].append(game_progress)
                        elif unlocked > 0:
                            summary["games_with_progress"].append(game_progress)
            except Exception:
                continue
        
        # Calculate overall completion
        if summary["total_achievements"] > 0:
            summary["completion_percentage"] = round(
                (summary["total_unlocked"] / summary["total_achievements"]) * 100, 2
            )
        
        # Sort games by completion
        summary["games_with_progress"].sort(key=lambda x: x["completion"], reverse=True)
        
        return summary


# ==================== Helper Functions ====================

def steam_id_64_to_32(steam_id_64: int) -> int:
    """Convert Steam ID 64 to Steam ID 32"""
    return steam_id_64 - 76561197960265728


def steam_id_32_to_64(steam_id_32: int) -> int:
    """Convert Steam ID 32 to Steam ID 64"""
    return steam_id_32 + 76561197960265728


def format_playtime(minutes: int) -> str:
    """Convert playtime from minutes to human-readable format"""
    hours = minutes / 60
    if hours < 1:
        return f"{minutes} minutes"
    elif hours < 24:
        return f"{hours:.1f} hours"
    else:
        days = hours / 24
        return f"{days:.1f} days ({hours:.0f} hours)"


# ==================== Example Usage ====================

def main():
    """Example usage of the Steam API client"""

    # Initialize with your API key
    api_key = "YOUR_API_KEY_HERE"  # Get from https://steamcommunity.com/dev/apikey
    steam = SteamAPI(api_key)

    # Example Steam ID (Gabe Newell's public profile)
    steam_id = "76561197960287930"

    print("=" * 60)
    print("STEAM API INFORMATION GETTER")
    print("=" * 60)

    # Get player summary
    print("\n1. PLAYER SUMMARY")
    print("-" * 60)
    player_data = steam.get_player_summaries([steam_id])
    if player_data.get("response", {}).get("players"):
        player = player_data["response"]["players"][0]
        print(f"Name: {player.get('personaname')}")
        print(f"Profile URL: {player.get('profileurl')}")
        print(f"Avatar: {player.get('avatarfull')}")
        print(f"Status: {player.get('personastate')}")

    # Get owned games
    print("\n2. OWNED GAMES")
    print("-" * 60)
    games_data = steam.get_owned_games(steam_id)
    if games_data.get("response", {}).get("games"):
        game_count = games_data["response"]["game_count"]
        print(f"Total Games: {game_count}")
        print("\nTop 5 Most Played:")
        games = sorted(games_data["response"]["games"],
                      key=lambda x: x.get("playtime_forever", 0),
                      reverse=True)[:5]
        for game in games:
            playtime = format_playtime(game.get("playtime_forever", 0))
            print(f"  - {game.get('name')}: {playtime}")

    # Get recently played games
    print("\n3. RECENTLY PLAYED GAMES")
    print("-" * 60)
    recent_data = steam.get_recently_played_games(steam_id)
    if recent_data.get("response", {}).get("games"):
        for game in recent_data["response"]["games"]:
            print(f"  - {game.get('name')}")
            print(f"    Last 2 weeks: {format_playtime(game.get('playtime_2weeks', 0))}")

    # Get Steam level
    print("\n4. STEAM LEVEL")
    print("-" * 60)
    level_data = steam.get_steam_level(steam_id)
    if level_data.get("response"):
        print(f"Level: {level_data['response'].get('player_level')}")

    # Get news for a game (example: Counter-Strike 2, App ID: 730)
    print("\n5. GAME NEWS (Counter-Strike 2)")
    print("-" * 60)
    news_data = steam.get_news_for_app(730, count=3, max_length=150)
    if news_data.get("appnews", {}).get("newsitems"):
        for item in news_data["appnews"]["newsitems"]:
            print(f"\n  Title: {item.get('title')}")
            print(f"  URL: {item.get('url')}")

    # Get current players for a game
    print("\n6. CURRENT PLAYERS (Counter-Strike 2)")
    print("-" * 60)
    players_data = steam.get_number_of_current_players(730)
    if players_data.get("response"):
        player_count = players_data["response"].get("player_count")
        print(f"Current Players: {player_count:,}")

    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
