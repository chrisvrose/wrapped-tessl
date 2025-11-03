# Complete Steam Web API Knowledge Base

## Overview

The Steam Web API allows developers to access Steam platform data including user profiles, game information, achievements, statistics, and more.

**Base URL**: `https://api.steampowered.com`
**Partner URL**: `https://partner.steam-api.com` (requires publisher access)

## Authentication

### API Key
- **Required for**: Most API endpoints
- **Get your key**: https://steamcommunity.com/dev/apikey
- **Usage**: Pass as `key` parameter in requests
- **Terms of Use**: Must agree to Steam API Terms

### OAuth 2.0
- **Required for**: Trading, inventory, private account data
- **Use case**: When accessing user's own private data
- **Scope**: Limited to authenticated user's account

## Request Format

```
https://api.steampowered.com/<interface>/<method>/<version>/?key=<api_key>&<parameters>
```

**Components**:
- `interface`: API interface (e.g., ISteamUser, IPlayerService)
- `method`: Specific method (e.g., GetPlayerSummaries)
- `version`: API version (e.g., v1, v0001, v0002)
- `parameters`: Query parameters

**Response Formats**:
- `format=json` (default, recommended)
- `format=xml`
- `format=vdf` (Valve Data Format)

## Complete Interface List

### 1. ISteamUser
**Purpose**: User account information

**Methods**:
- `GetPlayerSummaries (v0002)`: Get basic profile information
  - Params: `steamids` (comma-separated, max 100)
  - Returns: persona name, profile URL, avatars, online status, visibility state
  - Public data: Always available
  - Private data: Only if profile is public

- `GetFriendList (v0001)`: Get user's friends list
  - Params: `steamid`, `relationship` (default: "friend")
  - Returns: List of Steam IDs with friend_since timestamps
  - Requires: Public profile

- `GetPlayerBans (v1)`: Get ban status
  - Params: `steamids` (comma-separated)
  - Returns: VAC bans, game bans, community bans, economy ban status

- `ResolveVanityURL (v0001)`: Convert vanity URL to Steam ID
  - Params: `vanityurl`, `url_type` (1=individual, 2=group, 3=game)
  - Returns: 64-bit Steam ID

### 2. IPlayerService
**Purpose**: Player-related services and game library

**Methods**:
- `GetOwnedGames (v0001)`: Get user's game library
  - Params: `steamid`, `include_appinfo`, `include_played_free_games`, `appids_filter`
  - Returns: List of owned games with playtime data
  - Data: app_id, name, playtime_forever, playtime_2weeks, img_icon_url, img_logo_url

- `GetRecentlyPlayedGames (v0001)`: Games played in last 2 weeks
  - Params: `steamid`, `count` (0 = all)
  - Returns: Recently played games with recent playtime

- `GetSteamLevel (v1)`: Get user's Steam level
  - Params: `steamid`
  - Returns: player_level (integer)

- `GetBadges (v1)`: Get user's badges
  - Params: `steamid`
  - Returns: List of badges with unlock times, XP, level

- `GetCommunityBadgeProgress (v1)`: Badge progress
  - Params: `steamid`, `badgeid` (optional)
  - Returns: Quest completion progress

### 3. ISteamUserStats
**Purpose**: Game statistics and achievements

**Methods**:
- `GetPlayerAchievements (v0001)`: User achievements for a game
  - Params: `steamid`, `appid`, `l` (language, optional)
  - Returns: Achievement list with unlock status and timestamps
  - Requires: Public game stats

- `GetUserStatsForGame (v0002)`: User stats for a game
  - Params: `steamid`, `appid`
  - Returns: Detailed game statistics (kills, deaths, wins, etc.)
  - Game-specific: Each game defines its own stats

- `GetGlobalAchievementPercentagesForApp (v0002)`: Achievement rarity
  - Params: `gameid` (app_id)
  - Returns: Global unlock percentages for all achievements
  - Public: No authentication required

- `GetSchemaForGame (v0002)`: Game stats schema
  - Params: `appid`, `l` (language)
  - Returns: All available stats and achievements for a game

- `GetNumberOfCurrentPlayers (v1)`: Current player count
  - Params: `appid`
  - Returns: Real-time player count
  - Public: No authentication required

- `GetGlobalStatsForGame (v1)`: Aggregate game stats
  - Params: `appid`, `count`, `name[]` (stat names)
  - Returns: Global statistics across all players

### 4. ISteamApps
**Purpose**: Steam application (game) information

**Methods**:
- `GetAppList (v2)`: Complete list of Steam apps
  - Params: None
  - Returns: All apps with app_id and name
  - Warning: Very large response (50,000+ apps)
  - Recommendation: Cache this data

- `UpToDateCheck (v1)`: Check if app version is current
  - Params: `appid`, `version`
  - Returns: up_to_date (boolean), version_is_listable

- `GetServersAtAddress (v1)`: Game servers at IP
  - Params: `addr` (IP address)
  - Returns: List of game servers at that address

### 5. ISteamNews
**Purpose**: Game news and announcements

**Methods**:
- `GetNewsForApp (v0002)`: Get news for a game
  - Params: `appid`, `count`, `maxlength`, `enddate`, `feeds` (optional)
  - Returns: News items with title, URL, author, contents, date
  - Public: No authentication required
  - Feeds: Can filter by specific news sources

### 6. IEconService
**Purpose**: Steam Economy (Trading & Inventory)

**Methods**:
- `GetTradeOffers (v1)`: Get trade offers
  - Params: `get_sent_offers`, `get_received_offers`, `get_descriptions`, `active_only`, `historical_only`, `time_historical_cutoff`
  - Returns: Trade offers with items, status, descriptions
  - Requires: API key with trading permissions or OAuth

- `GetTradeOffer (v1)`: Get specific trade offer
  - Params: `tradeofferid`, `language`
  - Returns: Single trade offer details

- `GetTradeHistory (v1)`: Trade history
  - Params: `max_trades`, `start_after_time`, `start_after_tradeid`, `navigating_back`, `include_failed`
  - Returns: Past trade transactions
  - Requires: Authentication

- `GetInventoryItemsWithDescriptions (v1)`: Get inventory items
  - Params: `steamid`, `appid`, `contextid`
  - Returns: User's inventory for specific game
  - Requires: Public inventory

### 7. ISteamEconomy
**Purpose**: Game economy information

**Methods**:
- `GetAssetClassInfo (v0001)`: Item details
  - Params: `appid`, `class_count`, `classid0`, `instanceid0`
  - Returns: Item descriptions, icons, market info

- `GetAssetPrices (v0001)`: Item prices
  - Params: `appid`, `currency`, `language`
  - Returns: Standardized prices for in-game items

### 8. ISteamWebAPIUtil
**Purpose**: API metadata and discovery

**Methods**:
- `GetSupportedAPIList (v1)`: List all API interfaces
  - Params: `key` (optional)
  - Returns: All available interfaces, methods, parameters
  - Use: API discovery and documentation

- `GetServerInfo (v1)`: API server information
  - Params: None
  - Returns: Server time, server version

### 9. IAuthenticationService
**Purpose**: Authentication and login (Requires OAuth)

**Methods**:
- `BeginAuthSessionViaCredentials`: Start login session
- `GenerateAccessTokenForApp`: Generate access token
- `GetAuthSessionInfo`: Get session details
- `UpdateAuthSessionWithSteamGuardCode`: 2FA verification
- `RevokeToken`: Revoke access token

### 10. ICommunityService
**Purpose**: Steam Community features

**Methods**:
- `GetCommentThread`: Get comment threads
- `PostCommentToThread`: Post comments
- `GetUserPartnerEventNews`: User's partner events
- `GetClanAnnouncementVoteForUser`: Clan announcement votes

### 11. IPublishedFileService
**Purpose**: Steam Workshop and user-generated content

**Methods**:
- `QueryFiles`: Search workshop items
- `GetDetails`: Get file details
- `GetUserFiles`: Get user's workshop files
- `Subscribe`: Subscribe to workshop item
- `Unsubscribe`: Unsubscribe from workshop item

### 12. Game-Specific Interfaces

#### IDOTA2Match_570 (Dota 2)
- `GetMatchHistory`: Get match history
- `GetMatchDetails`: Detailed match information
- `GetLeagueListing`: List of leagues
- `GetLiveLeagueGames`: Currently live games
- `GetTopLiveGame`: Featured live game

#### ICSGOServers_730 (Counter-Strike 2/GO)
- `GetGameServersStatus`: Server status
- `GetGameMapsPlaytime`: Map statistics

#### ITFItems_440 (Team Fortress 2)
- `GetPlayerItems`: Player inventory
- `GetSchema`: Item schema

## Data Types & Structures

### Steam IDs
- **64-bit Steam ID**: Primary identifier (e.g., 76561197960287930)
- **32-bit Steam ID**: Legacy format (Steam ID 64 - 76561197960265728)
- **Steam ID 3**: Modern format [U:1:12345]
- **Vanity URL**: Custom profile URL (e.g., /id/gabelogannewell)

### Persona States
- 0: Offline
- 1: Online
- 2: Busy
- 3: Away
- 4: Snooze
- 5: Looking to trade
- 6: Looking to play

### Visibility States
- 1: Private
- 2: Friends only
- 3: Public

### Profile States
- 0: Profile not set up
- 1: Profile set up

## Common App IDs

| Game | App ID |
|------|--------|
| Counter-Strike 2 | 730 |
| Dota 2 | 570 |
| Team Fortress 2 | 440 |
| Portal 2 | 620 |
| Half-Life 2 | 220 |
| Left 4 Dead 2 | 550 |
| Rust | 252490 |
| GTA V | 271590 |
| Apex Legends | 1172470 |
| Baldur's Gate 3 | 1086940 |

**Find more**: https://steamdb.info/

## Best Practices

### Rate Limiting
- **Recommended limit**: Max 100,000 requests/day
- **Burst limit**: Avoid rapid successive calls
- **Implement**: Exponential backoff for 429 errors
- **Cache**: Store responses to reduce API calls

### Error Handling
- **HTTP 200**: Success
- **HTTP 400**: Bad request (check parameters)
- **HTTP 401**: Unauthorized (invalid API key)
- **HTTP 403**: Forbidden (insufficient permissions)
- **HTTP 429**: Too many requests (rate limited)
- **HTTP 500**: Internal server error (retry later)
- **HTTP 503**: Service unavailable (maintenance)

### Privacy Compliance
- **Respect privacy settings**: Don't try to circumvent private profiles
- **User consent**: Get permission before accessing user data
- **Data storage**: Follow Steam's terms for caching/storing data
- **Attribution**: Clearly indicate data source is Steam

### Performance Optimization
- **Batch requests**: Get multiple Steam IDs in one call when possible
- **Parallel requests**: Use async/concurrent requests for independent calls
- **Cache strategically**:
  - App list: Cache for days/weeks
  - Player summaries: Cache for minutes
  - Current players: Cache for seconds
- **Conditional requests**: Use ETags if available

## Common Use Cases

### 1. User Profile Dashboard
```
GET GetPlayerSummaries -> Basic info
GET GetOwnedGames -> Game library
GET GetSteamLevel -> Level
GET GetBadges -> Badges
GET GetFriendList -> Friends
```

### 2. Game Statistics Display
```
GET GetPlayerAchievements -> Achievement progress
GET GetUserStatsForGame -> Detailed stats
GET GetGlobalAchievementPercentagesForApp -> Achievement rarity
GET GetSchemaForGame -> Achievement/stat definitions
```

### 3. Gaming Activity Tracker
```
GET GetRecentlyPlayedGames -> Recent activity
GET GetOwnedGames -> Total playtime
GET GetPlayerAchievements -> Recent achievements
```

### 4. Game Community Monitor
```
GET GetNumberOfCurrentPlayers -> Player count
GET GetNewsForApp -> Latest news
GET GetGlobalStatsForGame -> Community stats
```

## Limitations & Restrictions

### Profile Privacy
- Private profiles: Very limited data access
- Friends-only: No access without friendship
- Public profiles: Full API access
- Cannot bypass: Privacy settings are enforced

### API Key Restrictions
- **Standard keys**: Public API access only
- **Publisher keys**: Additional endpoints for your games
- **OAuth tokens**: User-specific private data

### Data Freshness
- Most data: Real-time or near real-time
- Some stats: May have delay (minutes to hours)
- Cached data: Varies by endpoint

### Prohibited Uses
- **Don't scrape**: Respect rate limits
- **Don't redistribute**: Raw API data in bulk
- **Don't circumvent**: Privacy or security measures
- **Don't impersonate**: Steam or Valve services

## Advanced Topics

### Service Interface Pattern
Some newer APIs use a different parameter format:
```
?key=XXX&format=json&input_json={"steamid": 123, "param": "value"}
```
JSON must be URL-encoded.

### OpenID Authentication
Steam supports OpenID 2.0 for user login verification without passwords.

### WebSocket APIs
Some real-time features (chat, notifications) use WebSocket connections, not REST API.

### Partner API
Publishers get access to:
- Sales data for their games
- Player analytics
- Microtransaction APIs
- Enhanced game data

## Useful Tools & Resources

### Official
- API Key Registration: https://steamcommunity.com/dev/apikey
- Steamworks Documentation: https://partner.steamgames.com/doc/webapi
- Terms of Use: https://steamcommunity.com/dev/apiterms

### Community
- API Documentation: https://steamapi.xpaw.me/
- Valve Developer Wiki: https://developer.valvesoftware.com/wiki/Steam_Web_API
- SteamDB: https://steamdb.info/
- Steam ID Finder: https://steamid.io/

### Libraries
- Python: `steampy`, `steam` package
- Node.js: `steamapi`, `steam-user`
- PHP: `SteamCondenser`
- C#: `SteamKit2`

## Troubleshooting Guide

### Issue: Empty Response
**Causes**:
- Private profile
- Invalid Steam ID
- No data for that endpoint
**Solution**: Verify profile is public, check Steam ID format

### Issue: "Invalid API Key"
**Causes**:
- Wrong key
- Key not active
- Domain mismatch
**Solution**: Check key at steamcommunity.com/dev/apikey

### Issue: "Access Denied"
**Causes**:
- Insufficient permissions
- Private data without OAuth
**Solution**: Use OAuth for private data, or request public profile

### Issue: Rate Limited
**Causes**:
- Too many requests
- Burst traffic
**Solution**: Implement exponential backoff, reduce request frequency

### Issue: Outdated Data
**Causes**:
- Cache delays
- Profile just updated
**Solution**: Wait and retry, some data has natural delays

## Security Considerations

### API Key Security
- **Never expose**: Don't commit to public repos
- **Environment variables**: Store in .env files
- **Rotate regularly**: Generate new keys periodically
- **Limit domain**: Restrict to specific domains when possible

### Data Handling
- **Sanitize input**: Validate Steam IDs and parameters
- **Secure storage**: Encrypt sensitive cached data
- **HTTPS only**: Always use HTTPS for requests
- **Audit logs**: Track API usage for anomalies

## Summary

The Steam Web API provides comprehensive access to:
- ✅ User profiles and social data
- ✅ Game libraries and playtime
- ✅ Achievements and statistics
- ✅ Real-time player counts
- ✅ Game news and updates
- ✅ Trading and inventory (with auth)
- ✅ Workshop and community content

**Key Requirements**:
1. API key from steamcommunity.com/dev/apikey
2. Respect rate limits and privacy settings
3. Cache data appropriately
4. Follow Steam's Terms of Service

**Best For**:
- Gaming statistics websites
- Steam profile displays
- Achievement trackers
- Game analytics
- Community tools

This knowledge base covers all major Steam Web API features as of January 2025.
