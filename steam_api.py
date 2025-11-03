"""
Steam API Information Getter
A comprehensive Python client for interacting with Steam Web API

Documentation: https://steamcommunity.com/dev
API Reference: https://steamapi.xpaw.me/
"""

import requests
import json
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
        url = f"{self.BASE_URL}/{interface}/{method}/{version}/"

        request_params = {"key": self.api_key, "format": format_type}
        if params:
            request_params.update(params)

        try:
            response = self.session.get(url, params=request_params)
            response.raise_for_status()
            return response.json() if format_type == "json" else response.text
        except requests.exceptions.RequestException as e:
            print(f"Error making request: {e}")
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
            include_appinfo: Include game name and logo info
            include_played_free_games: Include free games the user has played
        """
        return self._make_request(
            "IPlayerService",
            "GetOwnedGames",
            "v0001",
            {
                "steamid": steam_id,
                "include_appinfo": 1 if include_appinfo else 0,
                "include_played_free_games": 1 if include_played_free_games else 0
            }
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
