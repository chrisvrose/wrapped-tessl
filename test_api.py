"""
Quick test script to verify Steam API connection and profile access
"""

import os
from dotenv import load_dotenv
from steam_api import SteamAPI

load_dotenv()

API_KEY = os.getenv("STEAMKEY")
PLAYER_ID = os.getenv("PLAYER_ID")

if not API_KEY:
    print("❌ STEAMKEY not found in .env")
    exit(1)

if not PLAYER_ID:
    print("❌ PLAYER_ID not found in .env")
    exit(1)

print(f"Testing Steam API connection...")
print(f"API Key: {API_KEY[:10]}...")
print(f"Player ID: {PLAYER_ID}")
print("=" * 60)

steam = SteamAPI(API_KEY)

# Test 1: Get player summary
print("\n1️⃣  Testing GetPlayerSummaries...")
summary = steam.get_player_summaries([PLAYER_ID])
if summary.get("response", {}).get("players"):
    player = summary["response"]["players"][0]
    print(f"✅ Success! Found player: {player.get('personaname')}")
    print(f"   Profile: {player.get('profileurl')}")
    print(f"   Visibility: {player.get('communityvisibilitystate')} (3=Public, 2=Friends, 1=Private)")
else:
    print("❌ Failed to get player summary")
    print(f"   Response: {summary}")

# Test 2: Get owned games
print("\n2️⃣  Testing GetOwnedGames...")
games = steam.get_owned_games(PLAYER_ID)
if games.get("response", {}).get("games"):
    game_count = games["response"]["game_count"]
    print(f"✅ Success! Found {game_count} games")
    
    # Show first 3 games
    for game in games["response"]["games"][:3]:
        print(f"   - {game.get('name', 'Unknown')} ({game.get('playtime_forever', 0)} mins)")
else:
    print("❌ Failed to get owned games")
    print(f"   Response: {games}")

# Test 3: Get Steam level
print("\n3️⃣  Testing GetSteamLevel...")
level = steam.get_steam_level(PLAYER_ID)
if level.get("response"):
    print(f"✅ Success! Steam Level: {level['response'].get('player_level')}")
else:
    print("❌ Failed to get Steam level")
    print(f"   Response: {level}")

# Test 4: Get achievements for a specific game (try TF2 - 440)
print("\n4️⃣  Testing GetPlayerAchievements (Team Fortress 2)...")
achievements = steam.get_player_achievements(PLAYER_ID, 440)
if achievements.get("playerstats", {}).get("success"):
    ach_list = achievements["playerstats"].get("achievements", [])
    unlocked = sum(1 for a in ach_list if a.get("achieved") == 1)
    total = len(ach_list)
    print(f"✅ Success! {unlocked}/{total} achievements unlocked")
else:
    print("⚠️  Could not get achievements (might not own game or stats are private)")
    print(f"   Response: {achievements}")

# Test 5: Get global achievement percentages
print("\n5️⃣  Testing GetGlobalAchievementPercentagesForApp (CS2 - 730)...")
global_ach = steam.get_global_achievement_percentages(730)
if global_ach.get("achievementpercentages"):
    ach_list = global_ach["achievementpercentages"].get("achievements", [])
    print(f"✅ Success! Found {len(ach_list)} global achievements")
else:
    print("❌ Failed to get global achievements")
    print(f"   Response: {global_ach}")

print("\n" + "=" * 60)
print("Testing complete!")
