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
3. Edit `.env` and add your key:
   ```bash
   STEAM_API_KEY=YOUR_ACTUAL_KEY_HERE
   ```

### 3. Run the Generator

#### Default (uses example Steam IDs):
```bash
python generate_datasets.py
```

#### With your own Steam ID:
```bash
python generate_datasets.py 76561197960287930
```

#### Multiple Steam IDs:
```bash
python generate_datasets.py 76561197960287930 76561198012345678
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
  - Statistics summary

### Top Games Leaderboard
- **File:** `top_games_{steam_id}.json`
- **Contains:**
  - Top 50 most played games
  - Ranked by playtime
  - Formatted playtime data
  - Game images

### Popular Games Stats
- **File:** `popular_games_stats.json`
- **Contains:**
  - Current player counts
  - Achievement percentages
  - Latest news
  - Data for: CS2, Dota 2, TF2, Apex, BG3, GTA V, Rust

### Steam Apps Sample
- **File:** `steam_apps_sample.json`
- **Contains:**
  - Sample of 1000 Steam apps
  - App IDs and names
  - Total app count metadata

## 🎯 Example Output Structure

### Player Profile (`profile_{steam_id}.json`)
```json
{
  "steam_id": "76561197960287930",
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
  "stats": {
    "total_games": 150,
    "total_playtime_hours": 1234.5,
    "games_played_2weeks": 5
  }
}
```

### Top Games (`top_games_{steam_id}.json`)
```json
{
  "top_games": [
    {
      "rank": 1,
      "name": "Counter-Strike 2",
      "playtime_hours": 1234.56,
      "playtime_formatted": "51.4 days (1234 hours)"
    }
  ]
}
```

## 🔧 Customization

### Change Output Directory
Edit in `generate_datasets.py`:
```python
OUTPUT_DIR = Path("public/data")  # Change to your preferred path
```

### Add More Games to Track
Edit the `popular_games` list in `generate_datasets.py`:
```python
popular_games = [
    {"app_id": 730, "name": "Counter-Strike 2"},
    {"app_id": YOUR_GAME_ID, "name": "Your Game"},
]
```

### Modify Data Collection
The `SteamDatasetGenerator` class has methods you can customize:
- `generate_player_profile()` - Player data
- `generate_game_stats()` - Game statistics
- `generate_top_games_leaderboard()` - Leaderboards

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

### Rate Limits
- Steam API has rate limits (~100,000 requests/day)
- The script includes appropriate delays
- Don't run too frequently in production

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

## 🐛 Troubleshooting

### "API_KEY not found"
- Make sure `.env` file exists
- Check that `STEAM_API_KEY` is set correctly
- No spaces around the `=` sign

### "No games data available"
- Profile might be private
- Use a public Steam profile
- Verify the Steam ID is correct

### Connection errors
- Check internet connection
- Steam API might be down (check status)
- Verify API key is valid

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
    "generate-data": "python generate_datasets.py"
  }
}
```

Then run:
```bash
npm run generate-data
```
