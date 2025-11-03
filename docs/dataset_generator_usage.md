# Steam Dataset Generator Usage Guide

## 📋 Overview

The `generate_datasets.py` script fetches data from the Steam Web API and saves it as JSON datasets in the `public/data/` directory for use in your React frontend.

## 🚀 Quick Start

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Your Steam API Key

1. Get your API key from: https://steamcommunity.com/dev/apikey
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your credentials:
   ```bash
   STEAMKEY=YOUR_ACTUAL_KEY_HERE
   PLAYER_ID=YOUR_STEAM_ID_HERE
   ```

### 3. Run the Generator

#### Default (uses PLAYER_ID from .env):
```bash
python3 generate_datasets.py
```

#### With a specific Steam ID (overrides .env):
```bash
python3 generate_datasets.py 76561197960287930
```

#### Multiple Steam IDs:
```bash
python3 generate_datasets.py 76561197960287930 76561198012345678
```

## 📦 Generated Datasets

All datasets are saved to `public/data/`:

### Player Profiles
- **File:** `profile_{steam_id}.json`
- **Contains:**
  - Player summary (name, avatar, profile URL, status)
  - Owned games with playtime
  - Recently played games (last 2 weeks)
  - Steam level
  - Badges
  - Achievement summary (total achievements, unlocked, completion %, perfect games)
  - Statistics summary

### Top Games Leaderboard
- **File:** `top_games_{steam_id}.json`
- **Contains:**
  - Top 50 most played games
  - Ranked by playtime
  - Formatted playtime data
  - Game images and icons
  - Recent playtime (last 2 weeks)

### Enriched Games Dataset
- **File:** `enriched_games_{steam_id}.json`
- **Contains:**
  - Top 20 games by playtime
  - Current player counts for each game
  - Achievement data (total achievements, unlocked count, percentage)
  - Global achievement percentages
  - Rich game metadata

### Achievements Dataset
- **File:** `achievements_{steam_id}.json`
- **Contains:**
  - Achievement summary statistics
  - List of perfect games (100% completion)
  - In-progress games with achievement data
  - Total achievements across all games

## 🎯 Example Output Structure

### Player Profile (`profile_{steam_id}.json`)
```json
{
  "steam_id": "76561198095524866",
  "generated_at": "2025-11-03T12:00:00",
  "player_summary": {
    "personaname": "PlayerName",
    "profileurl": "...",
    "avatarfull": "...",
    "personastate": 1
  },
  "owned_games": {
    "game_count": 150,
    "games": [...]
  },
  "achievement_summary": {
    "total_games": 150,
    "games_with_achievements": 45,
    "total_achievements": 2500,
    "total_unlocked": 1200,
    "completion_percentage": 48.0,
    "perfect_games": [...]
  },
  "stats": {
    "total_games": 150,
    "total_playtime_hours": 1234.5,
    "games_played_2weeks": 5,
    "total_achievements": 2500,
    "unlocked_achievements": 1200,
    "achievement_completion": 48.0,
    "perfect_games": 12
  }
}
```

### Top Games (`top_games_{steam_id}.json`)
```json
{
  "steam_id": "76561198095524866",
  "generated_at": "2025-11-03T12:00:00",
  "total_games": 150,
  "top_games": [
    {
      "rank": 1,
      "app_id": 730,
      "name": "Counter-Strike 2",
      "playtime_minutes": 74073,
      "playtime_hours": 1234.56,
      "playtime_formatted": "51.4 days (1234 hours)",
      "playtime_2weeks_minutes": 120,
      "img_icon_url": "...",
      "img_logo_url": "..."
    }
  ]
}
```

### Enriched Games (`enriched_games_{steam_id}.json`)
```json
{
  "steam_id": "76561198095524866",
  "generated_at": "2025-11-03T12:00:00",
  "games_count": 20,
  "games": [
    {
      "app_id": 730,
      "name": "Counter-Strike 2",
      "playtime_forever": 74073,
      "playtime_hours": 1234.56,
      "current_players": 500000,
      "achievements": {
        "total": 167,
        "unlocked": 45,
        "percentage": 26.95
      },
      "global_achievements": [...]
    }
  ]
}
```

### Achievements (`achievements_{steam_id}.json`)
```json
{
  "steam_id": "76561198095524866",
  "generated_at": "2025-11-03T12:00:00",
  "summary": {
    "total_games": 150,
    "games_with_achievements": 45,
    "total_achievements": 2500,
    "total_unlocked": 1200,
    "completion_percentage": 48.0,
    "perfect_games_count": 12
  },
  "perfect_games": [
    {
      "app_id": 620,
      "name": "Portal 2",
      "total_achievements": 51,
      "unlocked": 51,
      "percentage": 100.0
    }
  ],
  "games_with_progress": [...]
}
```

## 🔧 Customization

### Change Output Directory
Edit in `generate_datasets.py`:
```python
OUTPUT_DIR = Path("public/data")  # Change to your preferred path
```

### Modify Number of Games in Datasets
Edit the limits in `generate_datasets.py`:
```python
# Top games leaderboard (default: 50)
sorted_games = sorted(games, key=lambda x: x.get("playtime_forever", 0), reverse=True)[:50]

# Enriched games dataset (default: 20)
self.generate_enriched_games_dataset(steam_id, limit=20)

# Perfect games in achievements (default: 10)
"perfect_games": summary.get("perfect_games", [])[:10]
```

### Modify Data Collection
The `SteamDatasetGenerator` class has methods you can customize:
- `generate_player_profile()` - Player data with achievements
- `generate_top_games_leaderboard()` - Top games by playtime
- `generate_enriched_games_dataset()` - Games with current players & achievements
- `generate_achievements_dataset()` - Achievement tracking and progress

## 🌐 Using in React Frontend

Once generated, import the datasets in your React components:

```typescript
// Fetch from public directory
const response = await fetch('/data/profile_76561197960287930.json');
const profile = await response.json();

console.log(profile.player_summary.personaname);
console.log(profile.stats.total_games);
```

Or use in a React component:
```typescript
import { useEffect, useState } from 'react';

function SteamProfile({ steamId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`/data/profile_${steamId}.json`)
      .then(res => res.json())
      .then(data => setProfile(data));
  }, [steamId]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.player_summary.personaname}</h1>
      <p>Games: {profile.stats.total_games}</p>
      <p>Playtime: {profile.stats.total_playtime_hours}h</p>
    </div>
  );
}
```

## ⚠️ Important Notes

### Rate Limits & Error Handling
- Steam API has rate limits (~100,000 requests/day)
- Script includes 200ms delay between requests
- Automatically handles rate limit errors (429) with 60s cooldown
- 400/403 errors for games without achievements are normal and handled gracefully
- Don't run too frequently in production

### Expected Errors (Not Problems!)
- **400 Bad Request**: Games without achievement systems (e.g., old Valve games like Half-Life, Portal, CS:Source)
- **403 Forbidden**: Games with private stats or restricted data
- These are logged but don't stop the generation process

### Privacy
- Only public profile data is accessible
- Private profiles return limited information
- Respect user privacy settings

### Data Freshness
- Generated datasets are snapshots
- Re-run the script to update data
- Consider caching strategy for production

### API Key Security
- Never commit `.env` file to Git
- `.env` is already in `.gitignore`
- Keep your API key secret
- Use environment variable names: `STEAMKEY` and `PLAYER_ID`

## 🐛 Troubleshooting

### "STEAMKEY not found"
- Make sure `.env` file exists in the project root
- Check that `STEAMKEY` is set correctly (not `STEAM_API_KEY`)
- No spaces around the `=` sign
- Example: `STEAMKEY=F39409E5BB803EF9BD95EEB04626F640`

### "No player ID specified"
- Add `PLAYER_ID` to your `.env` file
- Or pass Steam ID as command line argument
- Example: `PLAYER_ID=76561198095524866`

### "No games data available"
- Profile might be private
- Use a public Steam profile
- Verify the Steam ID is correct

### Connection errors
- Check internet connection
- Steam API might be down (check status)
- Verify API key is valid
- Check for 401 Unauthorized errors (invalid key)
- Check for 429 Too Many Requests (rate limit - script will auto-retry)

### Many 400 errors appearing
- This is normal! Old games don't have achievements
- The script handles these automatically
- Data generation will still complete successfully
- Only worry if ALL requests fail

## 📚 Finding Steam IDs

### Your Own Steam ID:
1. Go to your Steam profile
2. Right-click → Copy Page URL
3. Use: https://steamid.io/ to convert

### Custom URL to Steam ID:
```bash
# Will be added to the script
python generate_datasets.py --vanity-url gabelogannewell
```

## 🔄 Automation

### Run on Schedule (Linux/Mac)
Add to crontab to run daily:
```bash
0 2 * * * cd /path/to/steamstats && python generate_datasets.py
```

### Run with npm script
Add to `package.json`:
```json
{
  "scripts": {
    "generate-data": "python3 generate_datasets.py"
  }
}
```

Then run:
```bash
npm run generate-data
```

## 🎮 What Gets Generated

The script creates **4 comprehensive datasets** for each Steam ID:

1. **Profile** - Complete player information with stats and badges
2. **Top Games** - 50 most played games ranked by hours
3. **Enriched Games** - Top 20 games with live player counts and achievements
4. **Achievements** - Perfect games and achievement progress tracking

All files are timestamped and include rich metadata for frontend visualization!
